<?php namespace App\Http\Controllers\Pedido;

use App\Http\Controllers\RestControllerTrait;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Models\PedidoRastreio;
use App\Models\PedidoRastreioPi;
use Carbon\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Input;
use Tymon\JWTAuth\Facades\JWTAuth;

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
     * Retorna uma lista de PI's pendentes de ação
     * 
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function index()
    {
        $pedidos = PedidoRastreio::with([
            'rastreioRef',
            'pi', 'pi.rastreioRef',
            'pedido', 'pedido.cliente', 'pedido.nota', 'pedido.endereco'
        ])
            ->rightJoin('pedido_rastreio_pis as pi', 'pi.rastreio_id', '=', 'pedido_rastreios.id')
            ->whereNull('pi.status')
            ->orderBy('pi.created_at', 'DESC')
            ->get(['pedido_rastreios.*']);

        return $this->listResponse($pedidos);
    }

    /**
     * Altera informações da PI
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
            $pi->usuario_id  = JWTAuth::parseToken()->authenticate()->id;

            $pi->fill(Input::only(['codigo_pi', 'motivo_status', 'status', 'valor_pago', 'acao', 'protocolo', 'pago_cliente', 'observacoes']));

            if (Input::get('data_pagamento_readable'))
                $pi->data_pagamento = Carbon::createFromFormat('d/m/Y', Input::get('data_pagamento_readable'))->format('Y-m-d');

            $pi->save();

            if (Input::has('valor_pago')) {
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
