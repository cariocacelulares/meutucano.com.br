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

    /**
     * Retorna uma pi com base no rastreio
     *
     * @param  int $id
     * @return array
     */
    public function show($id)
    {
        $m = Rastreio::class;
        if ($data = $m::find($id)) {
            return $this->showResponse(
                $data->pi ? PiTransformer::show($data->pi) : $data->pi
            );
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

        $list = $m::with(['rastreio', 'rastreio.pedido', 'rastreio.pedido.cliente', 'rastreio.pedido.endereco'])
            ->join('pedido_rastreios', 'pedido_rastreios.id', '=', 'pedido_rastreio_pis.rastreio_id')
            ->join('pedidos', 'pedidos.id', '=', 'pedido_rastreios.pedido_id')
            ->join('clientes', 'clientes.id', '=', 'pedidos.cliente_id')
            ->join('cliente_enderecos', 'cliente_enderecos.id', '=', 'pedidos.cliente_endereco_id')
            ->whereNull('pedido_rastreio_pis.status')
            ->orderBy('pedido_rastreio_pis.created_at', 'DESC');

        $list = $this->handleRequest($list, ['pedido_rastreio_pis.*']);

        return $this->listResponse(PiTransformer::pending($list));
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
                'exception' => $exception->getMessage()
            ]);
        }
    }
}
