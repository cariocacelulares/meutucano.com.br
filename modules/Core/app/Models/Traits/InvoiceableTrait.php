<?php namespace Core\Models\Traits;

use Core\Models\Invoice;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Input;

trait InvoiceableTrait
{
    public static function bootInvoiceableTrait()
    {
        static::created(function($parent) {
            $file = storage_path('app/public/' . self::UPLOAD_PATH) . '/' . $parent->attributes['file'];

            $xml = simplexml_load_file($file);

            $nfe = $xml->NFe->infNFe;

            $nfeProducts = (sizeof($nfe->det) > 1) ? $nfe->det : [$nfe->det];
            $cfop        = (int) $nfeProducts[0]->prod->CFOP;

            $data = [
                'number'    => (int) substr($xml->protNFe->infProt->chNFe, 25, 9),
                'series'    => (int) substr($xml->protNFe->infProt->chNFe, 34, 1),
                'cfop'      => (int) $cfop,
                'key'       => (string) $xml->protNFe->infProt->chNFe,
                'issued_at' => dateConvert($xml->NFe->infNFe->ide->dhEmi, 'Y-m-d\TH:i:sP', 'Y-m-d H:i:s')
            ];

            $invoice = new Invoice($data);
            $parent->invoice()->save($invoice);
        });
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\MorphOne
     */
    public function invoice()
    {
        return $this->morphOne('Core\Models\Invoice', 'invoiceable');
    }
}
