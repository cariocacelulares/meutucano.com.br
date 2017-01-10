<?php namespace Rastreio\Http\Controllers;

use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Rest\RestControllerTrait;
use Rastreio\Http\Controllers\Traits\RastreioTrait;
use InspecaoTecnica\Http\Controllers\Traits\InspecaoTecnicaTrait;
use Rastreio\Models\Rastreio;
use Rastreio\Models\Devolucao;
use Rastreio\Http\Requests\DevolucaoRequest as Request;
use Rastreio\Transformers\DevolucaoTransformer;

/**
 * Class DevolucaoController
 * @package Rastreio\Http\Controllers
 */
class DevolucaoController extends Controller
{
    use RestControllerTrait,
        RastreioTrait,
        InspecaoTecnicaTrait;

    const MODEL = Devolucao::class;

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
                    return $this->showResponse(DevolucaoTransformer::show($data));
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

        return $this->listResponse(DevolucaoTransformer::pending($lista));
    }

    /**
     * Cria novo recurso
     *
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function store(Request $request)
    {
        try {
            $this->aplicarDevolucao(Input::get(['inspecoes']));

            $devolucao = (self::MODEL)::create(Input::except(['protocolo', 'imagem']));

            $rastreio = Rastreio::find(Input::get('rastreio_id'));
            $rastreio->status = 5;
            $rastreio->save();

            $this->updateProtocolAndStatus($devolucao, Input::get('protocolo'), Input::file('imagem'));

            return $this->createdResponse($devolucao);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao salvar recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse(['exception' => $exception->getMessage()]);
        }
    }

    /**
     * Atualiza um recurso
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function update($id, Request $request)
    {
        try {
            $this->aplicarDevolucao(Input::get(['inspecoes']));

            $devolucao = (self::MODEL)::findOrFail($id);
            $devolucao->fill(Input::except(['protocolo']));
            $devolucao->save();

            $this->updateProtocolAndStatus($devolucao, Input::get('protocolo'));

            return $this->showResponse($devolucao);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao atualizar recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse([
                'exception' => strstr(get_class($exception), 'ModelNotFoundException')
                    ? 'Recurso nao encontrado'
                    : $exception->getMessage()
            ]);
        }
    }
}
