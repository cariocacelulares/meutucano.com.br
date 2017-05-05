<?php namespace Core\Facades;

use NFePHP\Extras\Danfe;
use Illuminate\Support\Facades\Facade;

class InvoiceProvider
{
    /**
     * Validate if uploaded XML is an NFe
     *
     * @param  string $file
     * @param  array $validCfops
     * @return object
     */
    public function validateNfeUpload($file, $validCfops = [])
    {
        $xml = simplexml_load_file($file);

        if (!$xml->NFe) throw new \Exception("Arquivo enviado não é um XML de Nota Fiscal.");
        if (!$xml->protNFe) throw new \Exception("Arquivo de NFe não emitido.");

        $nfe = $xml->NFe->infNFe;

        $nfeProducts = (sizeof($nfe->det) > 1) ? $nfe->det : [$nfe->det];
        $cfop        = (int) $nfeProducts[0]->prod->CFOP;

        /**
         * Verify CFOP
         */
        if (!in_array($cfop, $validCfops)) {
            throw new \Exception("CFOP da nota não é compatível com esta operação.");
        }

        return $nfe;
    }

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
                return notFoundResponse();
            }

            return response()
                ->make(file_get_contents($filePath), '200')
                ->header('Content-Type', 'text/xml');
        } catch (\Exception $exception) {
            \Log::warning(logMessage($exception, 'Falha ao tentar imprimir XML'), [$id]);

            return clientErrorResponse('Falha ao tentar imprimir XML');
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

            if (!file_exists($path)) {
                return notFoundResponse();
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

            return showResponse([]);
        } catch (\Exception $exception) {
            \Log::warning(logMessage($exception, 'Falha ao tentar imprimir DANFe'), [$file]);

            return clientErrorResponse('Falha ao tentar imprimir DANFe');
        }
    }
}

class Invoice extends Facade
{
    protected static function getFacadeAccessor()
    {
        return 'invoiceProvider';
    }
}
