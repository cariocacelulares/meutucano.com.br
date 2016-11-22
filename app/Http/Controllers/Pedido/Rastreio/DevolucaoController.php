<?php namespace App\Http\Controllers\Pedido\Rastreio;

use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use App\Models\Pedido\Rastreio;
use App\Models\Pedido\Rastreio\Devolucao;
use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Pedido\Rastreio\RastreioTrait;
use App\Http\Controllers\Inspecao\InspecaoTecnicaTrait;

/**
 * Class DevolucaoController
 * @package App\Http\Controllers\Pedido\Rastreio
 */
class DevolucaoController extends Controller
{
    use RestControllerTrait, RastreioTrait, InspecaoTecnicaTrait;

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
        $m = self::MODEL;

        if ($data = Rastreio::with(['pedido'])->where('id', '=', $id)->first()) {
            if ($data->devolucao) {
                $data = $m::with(['rastreio', 'rastreio.pedido'])->where('id', '=', $data->devolucao->id)->first();

                if ($data) {
                    return $this->showResponse($data);
                }
            }

            return $this->showResponse([
                'rastreio_id' => $data->id,
                'rastreio' => $data
            ]);
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

            $this->aplicarDevolucao(Input::get(['inspecoes']));

            $data = $m::create(Input::except(['protocolo', 'imagem']));

            $rastreio = Rastreio::find(Input::get('rastreio_id'));
            $rastreio->status = 5;
            $rastreio->save();

            $this->updateProtocolAndStatus($data, Input::get('protocolo'), Input::file('imagem'));

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

            $this->aplicarDevolucao(Input::get(['inspecoes']));

            $data->fill(Input::except(['protocolo']));
            $data->save();

            $this->updateProtocolAndStatus($data, Input::get('protocolo'));

            return $this->showResponse($data);
        } catch(\Exception $ex) {
            \Log::error(logMessage($ex, 'Erro ao atualizar recurso'));

            $data = ['form_validations' => $v->errors(), 'exception' => $ex->getMessage()];
            return $this->clientErrorResponse($data);
        }
    }
}