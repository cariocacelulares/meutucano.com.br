<?php namespace App\Http\Controllers\Pedido;

use App\Http\Controllers\RestControllerTrait;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Models\PedidoRastreio;
use App\Models\PedidoRastreioDevolucao;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Input;
use Tymon\JWTAuth\Facades\JWTAuth;

/**
 * Class PedidoRastreioDevolucaoController
 * @package App\Http\Controllers\Pedido
 */
class PedidoRastreioDevolucaoController extends Controller
{
    use RestControllerTrait;

    const MODEL = PedidoRastreioDevolucao::class;

    protected $validationRules = [];

    /**
     * Edit information about PI
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function edit($id)
    {
        try {
            $model = self::MODEL;

            $devolucao = $model::findOrNew($id);
            $rastreio_ref = PedidoRastreio::find($id);

            $devolucao->rastreio_id = $id;
            $devolucao->usuario_id  = JWTAuth::parseToken()->authenticate()->id;
            $devolucao->fill(Input::only(['motivo', 'acao', 'protocolo', 'pago_cliente', 'observacoes']));
            $devolucao->save();


            /**
             * Create new rastreio
             */
            if (Input::get('rastreio_ref.rastreio')) {
                $rastreio = new PedidoRastreio();

                $rastreio->pedido_id       = $rastreio_ref->pedido->id;
                $rastreio->tipo            = 1;
                $rastreio->rastreio_ref_id = $devolucao->rastreio_id;

                /**
                 * Data de envio
                 */
                $datetimeNota = \DateTime::createFromFormat('Y-m-d', date('Y-m-d'));
                $dataEnvio = $datetimeNota->add(date_interval_create_from_date_string('+1 day'));
                if ($dataEnvio->format('w') == '6') {
                    $dataEnvio = $dataEnvio->add(date_interval_create_from_date_string('+2 day'));
                } else if ($dataEnvio->format('w') == '0') {
                    $dataEnvio = $dataEnvio->add(date_interval_create_from_date_string('+1 day'));
                }

                $dataEnvio = $dataEnvio->format('Y-m-d');

                /**
                 * Tipo de envio
                 */
                $tipoRastreio    = substr(Input::get('rastreio_ref.rastreio'), 0, 2);
                $metodoEnvio     = null;
                if (in_array($tipoRastreio, Config::get('tucano.pac'))) {
                    $metodoEnvio = 'PAC';
                } elseif (in_array($tipoRastreio, Config::get('tucano.sedex'))) {
                    $metodoEnvio = 'SEDEX';
                }

                $rastreio->data_envio = $dataEnvio;
                $rastreio->rastreio   = Input::get('rastreio_ref.rastreio');
                $rastreio->servico    = $metodoEnvio;
                $rastreio->valor      = Input::get('rastreio_ref.valor', 0);
                $rastreio->prazo      = PedidoRastreioController::deadline(Input::get('rastreio_ref.rastreio'), $rastreio_ref->pedido->endereco->cep);

                $rastreio->save();
            }

            $rastreio_ref->status = 5;
            $rastreio_ref->save();

            return $this->showResponse([$devolucao]);
        } catch (\Exception $ex) {
            $data = ['exception' => $ex->getMessage() . $ex->getLine()];
            return $this->clientErrorResponse($data);
        }
    }
}