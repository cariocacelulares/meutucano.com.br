<?php namespace Core\Facades;

use Illuminate\Support\Facades\Facade;
use NFePHP\Extras\Danfe;
use App\Http\Controllers\Rest\RestControllerTrait;

/**
 * InvoiceProvider
 * @package Core\Facades;
 */
class InvoiceProvider
{
    use RestControllerTrait;

    /**
     * Returns invoice XML
     *
     * @param  string  $file file name
     * @return Response      Print XML file
     */
    public function xml($file)
    {
        try {
            $filePath = storage_path('app/public/nota/' . $file);

            if (!file_exists($filePath)) {
                return $this->notFoundResponse();
            }

            return response()
                ->make(file_get_contents($filePath), '200')
                ->header('Content-Type', 'text/xml');
        } catch (\Exception $exception) {
            \Log::warning(logMessage($exception, 'Falha ao tentar imprimir XML'), [$id]);

            return $this->clientErrorResponse('Falha ao tentar imprimir XML');
        }
    }

    /**
     * Return invoice DANFE PDF
     *
     * @param  string  $file       filename
     * @param  string  $returnType I-borwser, S-retorna o arquivo, D-força download, F-salva em arquivo local
     * @param  string  $dir        path dir i $returnType is F
     * @param  boolean $external   if DANFE is external
     * @return Response            PDF FILE
     */
    public function danfe($file, $returnType = 'I', $dir = null, $external = false)
    {
        try {
            $path = storage_path('app/public/nota/'. $file);

            // dd($path);

            if (!file_exists($path)) {
                return $this->notFoundResponse();
            }

            $danfe = new Danfe(
                file_get_contents($path),
                'P',
                'A4',
                ($external ? null : public_path('assets/img/logocarioca.jpg')),
                ($external ? null : public_path('assets/img/watermark.jpg')),
                $returnType,
                ''
            );

            $nomeDanfe = $dir ?: substr($file, 0, -4) . '.pdf';

            $danfe->montaDANFE('P', 'A4', 'L');
            $danfe->printDANFE($nomeDanfe, $returnType);

            return $this->showResponse([]);
        } catch (\Exception $exception) {
            \Log::warning(logMessage($exception, 'Falha ao tentar imprimir DANFe'), [$id]);

            return $this->clientErrorResponse('Falha ao tentar imprimir DANFe');
        }
    }
}

/**
 * Facade register
 * @package Core\Facades;
 */
class Invoice extends Facade
{
    protected static function getFacadeAccessor()
    {
        return 'invoiceProvider';
    }
}
