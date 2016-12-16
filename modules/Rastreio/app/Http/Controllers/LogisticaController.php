<?php namespace Rastreio\Http\Controllers;

use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Rest\RestControllerTrait;
use Rastreio\Http\Controllers\Traits\RastreioTrait;
use InspecaoTecnica\Http\Controllers\Traits\InspecaoTecnicaTrait;
use Rastreio\Models\Rastreio;
use Rastreio\Models\Logistica;

/**
 * Class LogisticaController
 * @package Rastreio\Http\Controllers
 */
class LogisticaController extends Controller
{
    use RestControllerTrait, RastreioTrait, InspecaoTecnicaTrait;

    const MODEL = Logistica::class;

    protected $validationRules = [];

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
                    return $this->showResponse($data);
                }
            }

            return $this->showResponse([
                'rastreio_id' => $data->id,
                'rastreio' => $data
            ]);
        }
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

            if ($v->fails()) {
                throw new \Exception("ValidationException");
            }

            $this->aplicarDevolucao(Input::get(['inspecoes']));

            $data = $m::create(Input::except(['protocolo', 'imagem']));

            if (Input::has('acao')) {
                $rastreio = Rastreio::find(Input::get('rastreio_id'));
                $rastreio->status = 5;
                $rastreio->save();

                $this->updateProtocolAndStatus($data, Input::get('protocolo'), Input::file('imagem'));
            }

            return $this->createdResponse($data);
        } catch (\Exception $ex) {
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
        } catch (\Exception $ex) {
            \Log::error(logMessage($ex, 'Erro ao atualizar recurso'));

            $data = ['form_validations' => $v->errors(), 'exception' => $ex->getMessage()];
            return $this->clientErrorResponse($data);
        }
    }
}
