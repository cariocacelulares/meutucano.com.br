<?php namespace Core\Http\Controllers\Partials\Traits;

use Illuminate\Support\Facades\Log;

/**
 * Class Uploadable
 * @package Core\Http\Controllers\Partials\Traits
 */
trait Uploadable
{
    public $uploadCount = 0;
    public $nfe         = null;
    public $protNfe     = null;

    /**
     * Upload mutiple files and prepare the return info
     *
     * @param  array  $files UploadedFile's
     * @return Response
     */
    public function uploadMultiple(array $files)
    {
        try {
            $this->uploadCount = 0;
            $return            = [];

            foreach ($files as $file) {
                $return[] = $this->uploadOnce($file);
            }

            Log::info(sprintf('Foram importados %d arquivo(s) de %d enviado(s).', $this->uploadCount, count($files)));

            return $this->createdResponse([
                'total'   => count($files),
                'success' => $this->uploadCount,
                'retorno' => $return
            ]);
        } catch (\Exception $exception) {
            Log::alert(logMessage($exception, 'Não foi possível fazer upload do(s) arquivo(s)'));

            return $this->clientErrorResponse([
                'exception' => $exception->getMessage()
            ]);
        }
    }

    /**
     * Get file, prepare return, validate type and process with processUpload method
     *
     * @param  UploadedFile $file
     * @return array
     */
    public function uploadOnce($file)
    {
        $message = false;
        $error   = false;

        $fileName = str_slug($file->getClientOriginalName() . '-' . date('YmdHis'));

        // Arquivo XML
        if (strstr($file->getMimetype(), 'xml') === false) {
            $error   = true;
            $message = 'Formato de arquivo inválido!';

            return [
                'object'  => null,
                'file'    => [
                    'full' => $fileName,
                    'min'  => substr($fileName, -12),
                ],
                'message' => $message,
                'error'   => true
            ];
        } else {
            $file->move(storage_path('app/public/nota'), $fileName);

            try {
                $xml = simplexml_load_file(storage_path('app/public/nota/' . $fileName));
            } catch (\Exception $e) {
                $error   = true;
                $message = 'XML inválido!';
            }

            if (!$error) {
                if (!isset($xml->NFe->infNFe)) {
                    $error   = true;
                    $message = 'Nota não reconhecida!';
                } else {
                    $this->nfe = $xml->NFe->infNFe;

                    if (isset($xml->protNFe)) {
                        $this->protNfe = $xml->protNFe;
                    } else {
                        $error   = true;
                        $message = 'Não foi possível identificar o protocolo da nota!';
                    }
                }
            }

            if (!$error) {
                $upload = $this->processUpload($fileName);

                if ($upload && is_array($upload)) {
                    $this->uploadCount++;
                } else {
                    $error = true;
                }
            }

            return [
                'object'  => $upload,
                'file'    => [
                    'full' => $fileName,
                    'min'  => substr($fileName, -12),
                ],
                'message' => ($message) ?: (is_string($upload) ? $upload : ''),
                'error'   => $error
            ];
        }
    }

    /**
     * Force 'child' class to implement this method
     *
     * @param  string $fileName name of UploadedFile
     */
    public function processUpload($fileName)
    {
        throw new \Exception('Você precisa implementar o método processUpload!', 1);
    }

    /**
     * Get product list from XML
     *
     * @return array
     */
    public function getProducts()
    {
        if (sizeof($this->nfe->det) > 1) {
            return $this->nfe->det;
        } else {
            return [$this->nfe->det];
        }
    }
}
