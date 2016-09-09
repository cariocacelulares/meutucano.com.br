<?php namespace App\Http\Controllers\Pedido\Rastreio;

use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use App\Models\Pedido\Rastreio;
use App\Models\Pedido\Rastreio\Logistica;
use Illuminate\Support\Facades\Input;

/**
 * Class LogisticaController
 * @package App\Http\Controllers\Pedido\Rastreio
 */
class LogisticaController extends Controller
{
    use RestControllerTrait;

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
        $m = Rastreio::class;
        if ($data = $m::find($id)) {
            return $this->showResponse($data->logistica);
        }

        return $this->notFoundResponse();
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

            if (Input::has('acao')) {
                $data->rastreio->status = 5;
                $data->rastreio->save();

                if ((int)$data->acao === 1) {
                    if ($protocolo = Input::get('protocolo')) {
                        if ($rastreio = Rastreio::find($data->rastreio_id)) {
                            $rastreio->protocolo = $protocolo;
                            $rastreio->save();
                        }
                    }
                }
            }

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

            if ((int)$data->acao === 1) {
                if ($protocolo = Input::get('protocolo')) {
                    if ($rastreio = Rastreio::find($data->rastreio_id)) {
                        $rastreio->protocolo = $protocolo;
                        $rastreio->save();
                    }
                }
            }

            return $this->showResponse($data);
        } catch(\Exception $ex) {
            \Log::error(logMessage($ex, 'Erro ao atualizar recurso'));

            $data = ['form_validations' => $v->errors(), 'exception' => $ex->getMessage()];
            return $this->clientErrorResponse($data);
        }
    }
}