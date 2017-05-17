<?php namespace Rastreio\Http\Controllers;

use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Rest\RestControllerTrait;
use Rastreio\Http\Controllers\Traits\RastreioTrait;
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
        RastreioTrait;

    const MODEL = Devolucao::class;

    public function __construct()
    {
        $this->middleware('permission:order_shipment_devolution_list', ['only' => ['index']]);
        $this->middleware('permission:order_shipment_devolution_show', ['only' => ['show']]);
        $this->middleware('permission:order_shipment_devolution_create', ['only' => ['store']]);
        $this->middleware('permission:order_shipment_devolution_update', ['only' => ['update']]);
        $this->middleware('permission:order_shipment_devolution_delete', ['only' => ['destroy']]);
    }

    /**
     * Retorna uma devolução com base no rastreio
     *
     * @param  int $id
     * @return array
     */
    public function show($id)
    {
        if ($data = Rastreio::with(['pedido'])->where('id', '=', $id)->first()) {
            if ($data->devolucao) {
                $data = Devolucao::with(['rastreio', 'rastreio.pedido'])->where('id', '=', $data->devolucao->id)->first();

                if ($data) {
                    return $this->showResponse(DevolucaoTransformer::show($data));
                }
            }

            return $this->showResponse([
                'rastreio_id' => $data->id,
                'rastreio'    => $data
            ]);
        }

        return $this->notFoundResponse();
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
            $devolucao = Devolucao::create(Input::except(['protocolo', 'imagem']));

            $rastreio = Rastreio::find(Input::get('rastreio_id'));
            $rastreio->status = 5;
            $rastreio->save();

            $this->updateProtocolAndStatus($devolucao, Input::get('protocolo'), Input::file('imagem'));

            return $this->createdResponse($devolucao);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao salvar recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
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
            $devolucao = Devolucao::findOrFail($id);
            $devolucao->fill(Input::except(['protocolo']));
            $devolucao->save();

            $this->updateProtocolAndStatus($devolucao, Input::get('protocolo'));

            return $this->showResponse($devolucao);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao atualizar recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }
}
