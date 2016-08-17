<?php namespace App\Http\Controllers\Pedido;

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
 * Class PedidoRastreioLogisticaController
 * @package App\Http\Controllers\Pedido
 */
class PedidoRastreioLogisticaController extends Controller
{
    use RestControllerTrait;

    const MODEL = PedidoRastreioLogistica::class;

    protected $validationRules = [];

    /**
     * Altera informações da logística
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function edit($id)
    {
        try {
            $model = self::MODEL;

            $logistica = $model::findOrNew($id);
            $rastreio_ref = PedidoRastreio::find($id);

            $logistica->rastreio_id = $id;
            $logistica->usuario_id  = JWTAuth::parseToken()->authenticate()->id;
            $logistica->fill(Input::only(['autorizacao', 'motivo', 'acao', 'protocolo', 'observacoes']));

            if (Input::get('data_postagem_readable'))
                $logistica->data_postagem = Carbon::createFromFormat('d/m/Y', Input::get('data_postagem_readable'))->format('Y-m-d');

            $logistica->save();

            if (Input::has('acao')) {
                $rastreio_ref->status = 5;
                $rastreio_ref->save();
            }

            return $this->showResponse([$logistica]);
        } catch (\Exception $ex) {
            $data = ['exception' => $ex->getMessage() . $ex->getLine()];
            return $this->clientErrorResponse($data);
        }
    }
}
