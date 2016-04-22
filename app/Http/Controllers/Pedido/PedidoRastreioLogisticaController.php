<?php namespace App\Http\Controllers\Pedido;

use App\Http\Controllers\RestControllerTrait;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Models\PedidoRastreio;
use App\Models\PedidoRastreioLogistica;
use Carbon\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Input;

/**
 * Class PedidoRastreioLogisticaController
 * @package App\Http\Controllers\Pedido
 */
class PedidoRastreioLogisticaController extends Controller
{
    use RestControllerTrait;

    const MODEL = PedidoRastreioLogistica::class;

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

            $logistica = $model::findOrNew($id);
            $rastreio_ref = PedidoRastreio::find($id);

            $logistica->rastreio_id = $id;
            $logistica->fill(Input::only(['autorizacao', 'motivo', 'acao', 'protocolo', 'observacoes']));

            if (Input::get('data_postagem_readable'))
                $logistica->data_postagem = Carbon::createFromFormat('d/m/Y', Input::get('data_postagem_readable'))->format('Y-m-d');

            $logistica->save();

            /**
             * Create new rastreio
             */
            if (Input::get('rastreio_ref.rastreio')) {
                $rastreio = new PedidoRastreio();

                $rastreio->pedido_id       = $rastreio_ref->pedido->id;
                $rastreio->tipo            = 1;
                $rastreio->rastreio_ref_id = $logistica->rastreio_id;

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

                $rastreio->data_envio = $logistica->data_postagem;
                $rastreio->rastreio   = Input::get('rastreio_ref.rastreio');
                $rastreio->servico    = $metodoEnvio;
                $rastreio->valor      = Input::get('rastreio_ref.valor', 0);
                $rastreio->prazo      = PedidoRastreioController::deadline(Input::get('rastreio_ref.rastreio'), $rastreio_ref->pedido->endereco->cep);

                $rastreio->save();
            }

            return $this->showResponse([$logistica]);
        } catch (\Exception $ex) {
            $data = ['exception' => $ex->getMessage() . $ex->getLine()];
            return $this->clientErrorResponse($data);
        }
    }
}