<?php namespace App\Http\Controllers\Devolucao;

use App\Http\Controllers\RestControllerTrait;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Models\PedidoRastreio;
use App\Models\PedidoRastreioDevolucao;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Input;
use Tymon\JWTAuth\Facades\JWTAuth;

/**
 * Class DevolucaoController
 * @package App\Http\Controllers\Devolucao
 */
class DevolucaoController extends Controller
{
    use RestControllerTrait;

    const MODEL = PedidoRastreioDevolucao::class;

    protected $validationRules = [];

    public function pending()
    {
        $m = self::MODEL;

        $lista = $m::with(['rastreio', 'rastreio.pedido', 'rastreio.pedido.cliente', 'rastreio.pedido.endereco'])
            ->join('pedido_rastreios', 'pedido_rastreios.id', '=', 'pedido_rastreio_devolucoes.rastreio_id')
            ->join('pedidos', 'pedidos.id', '=', 'pedido_rastreios.pedido_id')
            ->join('clientes', 'clientes.id', '=', 'pedidos.cliente_id')
            ->join('cliente_enderecos', 'cliente_enderecos.id', '=', 'pedidos.cliente_endereco_id')
            ->whereNull('pedido_rastreio_devolucoes.acao')
            ->orderBy('pedido_rastreio_devolucoes.created_at', 'DESC');

        $lista = $this->handleRequest($lista);

        return $this->listResponse($lista);
    }

    /**
     * Altera informações sobre a devolução
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

            $rastreio_ref->status = 5;
            $rastreio_ref->save();

            return $this->showResponse([$devolucao]);
        } catch (\Exception $ex) {
            $data = ['exception' => $ex->getMessage() . $ex->getLine()];
            return $this->clientErrorResponse($data);
        }
    }
}
