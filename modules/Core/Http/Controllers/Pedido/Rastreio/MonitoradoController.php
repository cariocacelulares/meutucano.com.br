<?php namespace Modules\Core\Http\Controllers\Pedido\Rastreio;

use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use Modules\Core\Models\Pedido\Rastreio\Monitorado;
use Illuminate\Support\Facades\Input;

/**
 * Class MonitoradoController
 * @package Modules\Core\Http\Controllers\Pedido\Rastreio
 */
class MonitoradoController extends Controller
{
    use RestControllerTrait;

    const MODEL = Monitorado::class;

    protected $validationRules = [];

    /**
     * Lista rastreios monitorados
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function tableList() {
        $m = self::MODEL;

        $list = $m::with(['rastreio', 'rastreio.pedido', 'rastreio.pedido.cliente', 'rastreio.pedido.endereco'])
            ->join('pedido_rastreios', 'pedido_rastreios.id', '=', 'pedido_rastreio_monitorados.rastreio_id')
            ->join('pedidos', 'pedidos.id', '=', 'pedido_rastreios.pedido_id')
            ->join('clientes', 'clientes.id', '=', 'pedidos.cliente_id')
            ->join('cliente_enderecos', 'cliente_enderecos.id', '=', 'pedidos.cliente_endereco_id')
            ->join('usuarios', 'usuarios.id', '=', 'pedido_rastreio_monitorados.usuario_id')
            ->where('usuario_id', '=', getCurrentUserId())
            ->orderBy('pedido_rastreios.created_at', 'DESC')
            ->orderBy('pedido_rastreios.data_envio', 'DESC');

        $list = $this->handleRequest($list);

        return $this->listResponse($list);
    }

    public function simpleList()
    {
        $m = self::MODEL;

        $list = $m::with(['rastreio', 'rastreio.devolucao', 'rastreio.pi', 'rastreio.logistica'])
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
        $m = self::MODEL;
        try {
            $v = \Validator::make(Input::all(), $this->validationRules);

            if($v->fails()) {
                throw new \Exception("ValidationException");
            }

            $rastreio_id = Input::get('rastreio_id');
            $usuario_id = getCurrentUserId();

            if (!$data = $m::where('rastreio_id', '=', $rastreio_id)->where('usuario_id', '=', $usuario_id)->first()) {
                $data = $m::create([
                    'rastreio_id' => $rastreio_id,
                    'usuario_id' => $usuario_id
                ]);
            }

            return $this->createdResponse($data);
        } catch(\Exception $ex) {
            $data = ['form_validations' => $v->errors(), 'exception' => $ex->getMessage()];

            \Log::error(logMessage($ex, 'Erro ao salvar recurso'), ['model' => self::MODEL]);
            return $this->clientErrorResponse($data);
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
        $m = self::MODEL;

        if (!$data = $m::where('rastreio_id', '=', $rastreio_id)->where('usuario_id', '=', getCurrentUserId())->first()) {
            return $this->notFoundResponse();
        }

        $data->delete();

        return $this->deletedResponse();
    }
}