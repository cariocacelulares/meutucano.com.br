<?php namespace App\Http\Controllers\Pedido;

use App\Http\Controllers\RestControllerTrait;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Models\PedidoNota;
use NFePHP\Extras\Danfe;

/**
 * Class PedidoNotaController
 * @package App\Http\Controllers\Pedido
 */
class PedidoNotaController extends Controller
{
    use RestControllerTrait;

    const MODEL = PedidoNota::class;

    protected $validationRules = [];

    /**
     * Generate XML from nota
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse|\Symfony\Component\HttpFoundation\Response
     */
    public function xml($id)
    {
        $model = self::MODEL;

        if ($nota = $model::find($id)) {
            $file_path = storage_path('app/public/nota/'. $nota->arquivo);

            if (file_exists($file_path)) {
                return response()->download($file_path, $nota->arquivo, [
                    'Content-Length: '. filesize($file_path)
                ]);
            }
        }

        return $this->notFoundResponse();
    }

    /**
     * Generate DANFE from nota
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function danfe($id)
    {
        $model = self::MODEL;

        if ($nota = $model::find($id)) {
            $file_path = storage_path('app/public/nota/'. $nota->arquivo);

            if (file_exists($file_path)) {
                $xml = file_get_contents($file_path);

                $danfe = new Danfe(
                    $xml,
                    'P',
                    'A4',
                    public_path('assets/img/logocarioca.jpg'),
                    public_path('assets/img/watermark.jpg'),
                    'I',
                    ''
                );

                $nomeDanfe = substr($nota->arquivo, 0, -4) . '.pdf';

                $danfe->montaDANFE('P', 'A4', 'L');
                $danfe->printDANFE($nomeDanfe, 'D');
            }
        }

        return $this->notFoundResponse();
    }
}