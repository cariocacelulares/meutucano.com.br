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
     * Retorna uma lista de devoluções pendentes de ação
     * 
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function index()
    {
        $pedidos = PedidoRastreio::with([
            'rastreioRef',
            'devolucao', 'devolucao.rastreioRef',
            'pedido', 'pedido.cliente', 'pedido.nota', 'pedido.endereco'
        ])
            ->rightJoin('pedido_rastreio_devolucoes as devolucao', 'devolucao.rastreio_id', '=', 'pedido_rastreios.id')
            ->whereNull('devolucao.acao')
            ->orderBy('devolucao.created_at', 'DESC')
            ->get(['pedido_rastreios.*']);

        return $this->listResponse($pedidos);
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
