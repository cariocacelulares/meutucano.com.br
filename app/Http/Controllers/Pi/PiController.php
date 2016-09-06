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
     * Retorna uma pi com base no rastreio
     *
     * @param  int $id
     * @return array
     */
    public function show($id)
    {
        $m = PedidoRastreio::class;
        if($data = $m::find($id)) {
            return $this->showResponse($data->pi);
        }

        return $this->notFoundResponse();
    }

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
            $data = $m::create(Input::all());

            if (Input::has('valor_pago')) {
                $data->rastreio->status = 8;
                $data->rastreio->save();
            } else {
                $data->rastreio->status = 7;
                $data->rastreio->save();
            }

            return $this->createdResponse($data);
        } catch(\Exception $ex) {
            $data = ['form_validations' => $v->errors(), 'exception' => $ex->getMessage()];

            \Log::error(logMessage($ex, 'Erro ao salvar recurso'));
            return $this->clientErrorResponse($data);
        }
    }
}
