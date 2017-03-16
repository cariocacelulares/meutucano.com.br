<?php namespace Core\Http\Controllers\Stock\Entry;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use Core\Http\Controllers\Partials\Traits\Uploadable;
use Core\Models\Stock\Entry\Invoice;
use Core\Models\Supplier;
use Core\Models\Produto;

/**
 * Class InvoiceController
 * @package Core\Http\Controllers\Stock\Entry
 */
class InvoiceController extends Controller
{
    use RestControllerTrait,
        Uploadable;

    const MODEL = Entry::class;

    /**
     * Call trait method to prepare and wrap upload
     *
     * @return Response
     */
    public function upload()
    {
        return $this->uploadOnce(Input::file('file'));
    }

    /**
     * Process all data to import info to invoice order
     *
     * @param  string $fileName name of UploadedFile
     * @return bool|array       return of process
     */
    public function processUpload($fileName)
    {
        try {
            $key = (string) $this->protNfe->infProt->chNFe;

            $supplier = [
                'company_name' => (string) $this->nfe->emit->xNome,
                'name'         => (string) $this->nfe->emit->xFant,
                'cnpj'         => (string) $this->nfe->emit->CNPJ,
                'ie'           => (string) $this->nfe->emit->IE,
                'crt'          => (string) $this->nfe->emit->CRT,
                'fone'         => (string) $this->nfe->emit->enderEmit->fone,
                'street'       => (string) $this->nfe->emit->enderEmit->xLgr,
                'number'       => (string) $this->nfe->emit->enderEmit->nro,
                'complement'   => (string) $this->nfe->emit->enderEmit->xCpl,
                'neighborhood' => (string) $this->nfe->emit->enderEmit->xBairro,
                'city'         => (string) $this->nfe->emit->enderEmit->xMun,
                'uf'           => (string) $this->nfe->emit->enderEmit->UF,
                'cep'          => (string) $this->nfe->emit->enderEmit->CEP,
                'country'      => (string) $this->nfe->emit->enderEmit->xPais,
            ];

            $products = [];
            foreach ($this->getProducts() as $product) {
                $qty   = (float)  $product->prod->qCom;
                $value = (float)  $product->prod->vUnCom;
                $ean   = (string) $product->prod->cEAN;
                $ncm   = (string) $product->prod->NCM;
                $title = (string) $product->prod->xProd;

                $titleVariation   = \TitleVariation::get($title, $ean, $ncm);
                $titleVariationId = $titleVariation ? $titleVariation->id : null;

                $sku            = $titleVariation ? $titleVariation->product_sku : null;
                $stocks         = $sku ? \Stock::getObjects($sku) : [];
                $productStockId = isset($stocks[0]) ? $stocks[0]->id : null;
                $produto        = $sku ? Produto::find($sku) : null;

                $products[] = [
                    'ean'                        => $ean,
                    'ncm'                        => $ncm,
                    'title'                      => $title,
                    'quantity'                   => $qty,
                    'unitary_value'              => $value,
                    'total_value'                => ($qty * $value),
                    'icms'                       => (float) $product->imposto->ICMS->ICMS00->pICMS,
                    'ipi'                        => (float) $product->imposto->IPI->IPITrib->pIPI,
                    'pis'                        => (float) $product->imposto->PIS->PISAliq->pPIS,
                    'cofins'                     => (float) $product->imposto->COFINS->COFINSAliq->pCOFINS,
                    'product_sku'                => $sku,
                    'product'                    => $produto,
                    'product_stock_id'           => $productStockId,
                    'stock'                      => isset($stocks[0]) ? $stocks[0] : null,
                    'stocks'                     => $stocks,
                ];
            }

            $invoice = [
                'file'     => 'app/public/nota/' . $fileName,
                'key'      => $key,
                'series'   => (string) $this->nfe->ide->serie,
                'number'   => (string) $this->nfe->ide->nNF,
                'model'    => (string) $this->nfe->ide->mod,
                'cfop'     => (string) $this->getProducts()[0]->prod->CFOP,
                'total'    => (float) $this->nfe->total->ICMSTot->vNF,
                'emission' => \DateTime::createFromFormat('Y-m-d\TH:i:sP', (string) $this->nfe->ide->dhEmi)->format('d/m/Y H:i:s'),
            ];

            return [
                'supplier' => $supplier,
                'invoice'  => $invoice,
                'products' => $products,
            ];
        } catch (\Exception $exception) {
            dd($exception);
        }
    }
}
