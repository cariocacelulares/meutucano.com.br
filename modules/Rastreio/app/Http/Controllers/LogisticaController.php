<?php namespace Rastreio\Http\Controllers;

use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Rest\RestControllerTrait;
use Rastreio\Http\Controllers\Traits\RastreioTrait;
use Rastreio\Models\Rastreio;
use Rastreio\Models\Logistica;
use Rastreio\Http\Requests\LogisticaRequest as Request;
use Rastreio\Transformers\LogisticaTransformer;

/**
 * Class LogisticaController
 * @package Rastreio\Http\Controllers
 */
class LogisticaController extends Controller
{
    use RestControllerTrait, RastreioTrait;

    const MODEL = Logistica::class;

    /**
     * Retorna uma pi com base no rastreio
     *
     * @param  int $id
     * @return array
     */
    public function show($id)
    {
        $m = self::MODEL;

        if ($data = Rastreio::with(['pedido'])->where('id', '=', $id)->first()) {
            if ($data->logistica) {
                $data = $m::with(['rastreio', 'rastreio.pedido'])->where('id', '=', $data->logistica->id)->first();

                if ($data) {
                    return $this->showResponse(LogisticaTransformer::show($data));
                }
            }

            return $this->showResponse([
                'rastreio_id' => $data->id,
                'rastreio'    => $data
            ]);
        }
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
            $logistica = (self::MODEL)::create(Input::except(['protocolo', 'imagem']));

            if (Input::has('acao')) {
                $rastreio = Rastreio::find(Input::get('rastreio_id'));
                $rastreio->status = 5;
                $rastreio->save();

                $this->updateProtocolAndStatus($logistica, Input::get('protocolo'), Input::file('imagem'));
            }

            return $this->createdResponse($logistica);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao salvar recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse([
                'exception' => $exception->getMessage()
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
            $logistica = (self::MODEL)::findOrFail($id);
            $logistica->fill(Input::except(['protocolo']));
            $logistica->save();

            $this->updateProtocolAndStatus($logistica, Input::get('protocolo'));

            return $this->showResponse($logistica);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao atualizar recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse([
                'exception' => $exception->getMessage()
            ]);
        }
    }
}
