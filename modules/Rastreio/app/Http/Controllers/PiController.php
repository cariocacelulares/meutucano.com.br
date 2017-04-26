<?php namespace Rastreio\Http\Controllers;

use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Rest\RestControllerTrait;
use Rastreio\Http\Controllers\Traits\RastreioTrait;
use Rastreio\Models\Rastreio;
use Rastreio\Models\Pi;
use Rastreio\Http\Requests\PiRequest as Request;
use Rastreio\Transformers\PiTransformer;

/**
 * Class PiController
 * @package Rastreio\Http\Controllers
 */
class PiController extends Controller
{
    use RestControllerTrait, RastreioTrait;

    const MODEL = Pi::class;

    public function __construct()
    {
        $this->middleware('permission:order_shipment_issue_list', ['only' => ['index']]);
        $this->middleware('permission:order_shipment_issue_show', ['only' => ['show']]);
        $this->middleware('permission:order_shipment_issue_create', ['only' => ['store']]);
        $this->middleware('permission:order_shipment_issue_update', ['only' => ['update']]);
        $this->middleware('permission:order_shipment_issue_delete', ['only' => ['destroy']]);
    }

    /**
     * Retorna uma pi com base no rastreio
     *
     * @param  int $id
     * @return array
     */
    public function show($id)
    {
        if ($data = Rastreio::find($id)) {
            return $this->showResponse(
                $data->pi ? PiTransformer::show($data->pi) : $data->pi
            );
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
            $pi = (self::MODEL)::create(Input::except(['protocolo']));

            $rastreio = Rastreio::find(Input::get('rastreio_id'));
            if (Input::has('valor_pago')) {
                $rastreio->status = 8;
            } else {
                $rastreio->status = 7;
            }

            $rastreio->save();

            $this->updateProtocolAndStatus($pi, Input::get('protocolo'));

            return $this->createdResponse($pi);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao salvar recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse(['exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()]);
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
            $pi = (self::MODEL)::findOrFail($id);
            $pi->fill(Input::except(['protocolo']));
            $pi->save();

            if (Input::has('valor_pago')) {
                $pi->rastreio->status = 8;
            } else {
                $pi->rastreio->status = 7;
            }

            $pi->rastreio->save();

            $this->updateProtocolAndStatus($pi, Input::get('protocolo'));

            return $this->showResponse($pi);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao atualizar recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }
}
