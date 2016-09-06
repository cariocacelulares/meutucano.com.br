<?php namespace App\Http\Controllers\Pedido;

use Carbon\Carbon;
use App\Http\Controllers\RestControllerTrait;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\ClienteEndereco;
use App\Models\Pedido;
use App\Models\PedidoImposto;
use App\Models\PedidoNota;
use App\Models\PedidoProduto;
use App\Models\PedidoRastreio;
use App\Models\Produto;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Input;

/**
 * Class PedidoController
 * @package App\Http\Controllers\Pedido
 */
class PedidoController extends Controller
{
    use RestControllerTrait;

    const MODEL = Pedido::class;

    protected $validationRules = [];

    /**
     * Lista pedidos para a tabela
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function tableList() {
        $m = self::MODEL;

        $list = $m::with(['cliente', 'endereco'])
            ->join('clientes', 'clientes.id', '=', 'pedidos.cliente_id')
            ->join('pedido_notas', 'pedido_notas.pedido_id', '=', 'pedidos.id')
            ->orderBy('pedidos.created_at', 'DESC');

        $list = $this->handleRequest($list);

        return $this->listResponse($list);
    }

    public function prioridade($pedido_id)
    {
        $m = self::MODEL;

        try {
            $prioridade = Input::get('priorizado');
            $prioridade = (int) $prioridade ? 1 : null;

            $pedido = $m::find($pedido_id);
            $pedido->priorizado = $prioridade;
            $pedido->save();

            return $this->showResponse($pedido);
        } catch(\Exception $ex) {
            $data = ['exception' => $ex->getMessage()];
            return $this->clientErrorResponse($data);
        }
    }

    public function alterarStatus($pedido_id) {
        $m = self::MODEL;

        try {
            $status = \Request::get('status');

            if (!$status && $status !== 0) {
                throw new Exception('"status" parameter not found!', 1);
            }

            $data = $m::find($pedido_id);
            $data->status = $status;
            $data->save();

            if ($status == 5) {
                $data->delete();
            }

            return $this->showResponse($data);
        } catch(\Exception $ex) {
            $data = ['exception' => $ex->getMessage()];
            return $this->clientErrorResponse($data);
        }
    }

    /**
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function show($id)
    {
        $m = self::MODEL;

        try {
            $data = $m::with([
                'cliente',
                'endereco',
                'nota',
                'rastreios',
                'produtos',
                'comentarios',
                'rastreios.devolucao',
                'rastreios.pi',
                'rastreios.logistica'
            ])->find($id);

            if ($data) {
                return $this->showResponse($data);
            }
        } catch (\Exception $e) {
            if ($e->getPrevious())
                throw $e->getPrevious();
            else
                throw $e;
        }

        return $this->notFoundResponse();
    }
}