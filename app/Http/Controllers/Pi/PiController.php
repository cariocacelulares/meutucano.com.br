<?php namespace App\Http\Controllers\Pi;

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
 * Class PiController
 * @package App\Http\Controllers\Pi
 */
class PiController extends Controller
{
    use RestControllerTrait;

    const MODEL = PedidoRastreioPi::class;

    protected $validationRules = [];

    /**
     * Retorna uma lista de PI's pendentes de ação
     * 
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function pending()
    {
        $m = self::MODEL;

        $lista = $m::with(['rastreio', 'rastreio.pedido', 'rastreio.pedido.cliente', 'rastreio.pedido.endereco'])
            ->join('pedido_rastreios', 'pedido_rastreios.id', '=', 'pedido_rastreio_pis.rastreio_id')
            ->join('pedidos', 'pedidos.id', '=', 'pedido_rastreios.pedido_id')
            ->join('clientes', 'clientes.id', '=', 'pedidos.cliente_id')
            ->join('cliente_enderecos', 'cliente_enderecos.id', '=', 'pedidos.cliente_endereco_id')
            ->whereNull('pedido_rastreio_pis.status')
            ->orderBy('pedido_rastreio_pis.created_at', 'DESC');

        $lista = $this->handleRequest($lista);

        return $this->listResponse($lista);
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
