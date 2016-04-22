<?php namespace App\Http\Controllers\Pedido;

use App\Http\Controllers\RestControllerTrait;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Models\PedidoRastreio;
use App\Models\PedidoRastreioPi;
use Carbon\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Input;

/**
 * Class PedidoRastreioPiController
 * @package App\Http\Controllers\Pedido
 */
class PedidoRastreioPiController extends Controller
{
    use RestControllerTrait;

    const MODEL = PedidoRastreioPi::class;

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

            $pi = $model::findOrNew($id);
            $rastreio_ref = PedidoRastreio::find($id);

            $pi->rastreio_id = $id;
            $pi->fill(Input::only(['codigo_pi', 'motivo_status', 'status', 'valor_pago', 'acao', 'protocolo', 'pago_cliente', 'observacoes']));

            if (Input::get('data_pagamento_readable'))
                $pi->data_pagamento = Carbon::createFromFormat('d/m/Y', Input::get('data_pagamento_readable'))->format('Y-m-d');

            $pi->save();

            /**
             * Create new rastreio
             */
            if (Input::get('rastreio_ref.rastreio')) {
                $rastreio = new PedidoRastreio();

                $rastreio->pedido_id       = $rastreio_ref->pedido->id;
                $rastreio->tipo            = 1;
                $rastreio->rastreio_ref_id = $pi->rastreio_id;

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

                $rastreio_ref->status = 8;
                $rastreio_ref->save();
            } else {
                $rastreio_ref->status = 7;
                $rastreio_ref->save();
            }

            return $this->showResponse([$pi]);
        } catch (\Exception $ex) {
            $data = ['exception' => $ex->getMessage() . $ex->getLine()];
            return $this->clientErrorResponse($data);
        }
    }
}