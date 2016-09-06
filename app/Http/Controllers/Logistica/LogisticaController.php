<?php namespace App\Http\Controllers\Logistica;

use App\Http\Controllers\RestControllerTrait;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Models\PedidoRastreio;
use App\Models\PedidoRastreioLogistica;
use Carbon\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Input;
use Tymon\JWTAuth\Facades\JWTAuth;

/**
 * Class LogisticaController
 * @package App\Http\Controllers\Logistica
 */
class LogisticaController extends Controller
{
    use RestControllerTrait;

    const MODEL = PedidoRastreioLogistica::class;

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
            }

            return $this->createdResponse($data);
        } catch(\Exception $ex) {
            $data = ['form_validations' => $v->errors(), 'exception' => $ex->getMessage()];

            \Log::error(logMessage($ex, 'Erro ao salvar recurso'));
            return $this->clientErrorResponse($data);
        }
    }
}
