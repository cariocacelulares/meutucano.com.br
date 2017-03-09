<?php namespace Core\Http\Controllers\Partials\Traits;

use Illuminate\Support\Facades\Log;

/**
 * Class Uploadable
 * @package Core\Http\Controllers\Partials\Traits
 */
trait Uploadable
{
    public $nfe     = null;
    public $protNfe = null;

    public function uploadMultiple(array $files)
    {
        try {
            $uploadCount = 0;
            $orders      = [];
            $return      = [];

            foreach ($files as $file) {
                $message = false;
                $error   = false;

                $fileName = $file->getClientOriginalName();

                // Arquivos XML
                if (strstr($file->getMimetype(), 'xml') === false) {
                    $error   = true;
                    $message = 'Formato de arquivo inválido!';

                    $return[] = [
                        'pedido'  => null,
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
                            $uploadCount++;
                        } else {
                            $error = true;
                        }
                    }

                    $return[] = [
                        'pedido'  => isset($upload['id']) ? $upload['id'] : $upload,
                        'file'    => [
                            'full' => $fileName,
                            'min'  => substr($fileName, -12),
                        ],
                        'message' => ($message) ?: (is_string($upload) ? $upload : ''),
                        'error'   => $error
                    ];
                }
            }

            Log::info(sprintf('Foram importados %d arquivo(s) de %d enviado(s).', $uploadCount, count($files)));

            return $this->createdResponse([
                'total'   => count($files),
                'success' => $uploadCount,
                'retorno' => $return
            ]);
        } catch (\Exception $exception) {
            Log::alert(logMessage($exception, 'Não foi possível fazer upload do(s) arquivo(s)'));

            return $this->clientErrorResponse([
                'exception' => $exception->getMessage()
            ]);
        }
    }

    public function processUpload($fileName)
    {
        throw new \Exception('Você precisa implementar o método processUpload!', 1);
    }

    public function getProducts()
    {
        if (sizeof($this->nfe->det) > 1) {
            return $this->nfe->det;
        } else {
            return [$this->nfe->det];
        }
    }
}
