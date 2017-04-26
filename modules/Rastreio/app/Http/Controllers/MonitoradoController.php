<?php namespace Rastreio\Http\Controllers;

use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use Rastreio\Models\Rastreio;
use Rastreio\Models\Monitorado;
use Rastreio\Transformers\RastreioTransformer;

/**
 * Class MonitoradoController
 * @package Rastreio\Http\Controllers
 */
class MonitoradoController extends Controller
{
    use RestControllerTrait;

    const MODEL = Monitorado::class;

    public function __construct()
    {
        $this->middleware('permission:order_shipment_monitor_list', ['only' => ['index']]);
        $this->middleware('permission:order_shipment_monitor_create', ['only' => ['store']]);
        $this->middleware('permission:order_shipment_monitor_delete', ['only' => ['destroy']]);
    }

    /**
     * Lista rastreios monitorados
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function tableList()
    {
        $this->middleware('permission:order_shipment_monitor_list');

        $list = Monitorado::with(['rastreio', 'rastreio.pedido', 'rastreio.pedido.cliente', 'rastreio.pedido.endereco'])
            ->join('pedido_rastreios', 'pedido_rastreios.id', '=', 'pedido_rastreio_monitorados.rastreio_id')
            ->join('pedidos', 'pedidos.id', '=', 'pedido_rastreios.pedido_id')
            ->join('clientes', 'clientes.id', '=', 'pedidos.cliente_id')
            ->join('cliente_enderecos', 'cliente_enderecos.id', '=', 'pedidos.cliente_endereco_id')
            ->join('usuarios', 'usuarios.id', '=', 'pedido_rastreio_monitorados.usuario_id')
            ->where('usuario_id', '=', getCurrentUserId())
            ->orderBy('pedido_rastreios.created_at', 'DESC')
            ->orderBy('pedido_rastreios.data_envio', 'DESC');

        $list = $this->handleRequest($list);

        return $this->listResponse(RastreioTransformer::monitorado($list));
    }

    public function simpleList()
    {
        $this->middleware('permission:order_shipment_monitor_list');

        $list = Monitorado::with(['rastreio', 'rastreio.devolucao', 'rastreio.pi', 'rastreio.logistica'])
            ->join('pedido_rastreios', 'pedido_rastreios.id', '=', 'pedido_rastreio_monitorados.rastreio_id')
            ->where('usuario_id', '=', getCurrentUserId())
            ->orderBy('pedido_rastreios.created_at', 'DESC')
            ->orderBy('pedido_rastreios.data_envio', 'DESC')
            ->get(['pedido_rastreio_monitorados.*']);

        return $this->listResponse($list);
    }

    /**
     * Cria novo recurso
     *
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function store()
    {
        try {
            $rastreio_id = Input::get('rastreio_id');
            $usuario_id  = getCurrentUserId();

            if (!$data = Monitorado::where('rastreio_id', '=', $rastreio_id)->where('usuario_id', '=', $usuario_id)->first()) {
                $data = Monitorado::create([
                    'rastreio_id' => $rastreio_id,
                    'usuario_id'  => $usuario_id
                ]);
            }

            return $this->createdResponse($data);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao salvar recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * Deleta um recurso
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function stop($rastreio_id)
    {
        $this->middleware('permission:order_shipment_monitor_delete');

        if (!$data = Monitorado::where('rastreio_id', '=', $rastreio_id)->where('usuario_id', '=', getCurrentUserId())->first()) {
            return $this->notFoundResponse();
        }

        $data->delete();

        return $this->deletedResponse();
    }
}
