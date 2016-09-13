<?php namespace App\Http\Controllers\Pedido\Rastreio;

use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use App\Models\Pedido\Rastreio;
use App\Models\Pedido\Rastreio\Devolucao;
use Illuminate\Support\Facades\Input;

/**
 * Class DevolucaoController
 * @package App\Http\Controllers\Pedido\Rastreio
 */
class DevolucaoController extends Controller
{
    use RestControllerTrait;

    const MODEL = Devolucao::class;

    protected $validationRules = [];

    /**
     * Retorna uma devolução com base no rastreio
     *
     * @param  int $id
     * @return array
     */
    public function show($id)
    {
        $m = Rastreio::class;
        if ($data = $m::find($id)) {
            return $this->showResponse($data->devolucao);
        }

        return $this->notFoundResponse();
    }

    /**
     * Retorna as devoluções sem ação
     *
     * @return array
     */
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
     * Cria novo recurso
     *
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function store()
    {
        $m = self::MODEL;
        try {
            $v = \Validator::make(Input::except(['protocolo']), $this->validationRules);

            if($v->fails()) {
                throw new \Exception("ValidationException");
            }
            $data = $m::create(Input::except(['protocolo']));

            $data->rastreio->status = 5;
            $data->rastreio->save();

            updateProtocolAndStatus($data, Input::get('protocolo'));

            return $this->createdResponse($data);
        } catch(\Exception $ex) {
            $data = ['form_validations' => $v->errors(), 'exception' => $ex->getMessage()];

            \Log::error(logMessage($ex, 'Erro ao salvar recurso'));
            return $this->clientErrorResponse($data);
        }
    }

    /**
     * Atualiza um recurso
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function update($id)
    {
        $m = self::MODEL;

        if (!$data = $m::find($id)) {
            return $this->notFoundResponse();
        }

        try {
            $v = \Validator::make(Input::except(['protocolo']), $this->validationRules);

            if ($v->fails()) {
                throw new \Exception("ValidationException");
            }

            $data->fill(Input::except(['protocolo']));
            $data->save();

            updateProtocolAndStatus($data, Input::get('protocolo'));

            return $this->showResponse($data);
        } catch(\Exception $ex) {
            \Log::error(logMessage($ex, 'Erro ao atualizar recurso'));

            $data = ['form_validations' => $v->errors(), 'exception' => $ex->getMessage()];
            return $this->clientErrorResponse($data);
        }
    }
}