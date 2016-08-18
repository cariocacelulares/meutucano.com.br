<?php namespace App\Http\Controllers\Pedido;

use App\Http\Controllers\RestControllerTrait;
use App\Http\Controllers\Controller;
use App\Models\PedidoComentario;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

/**
 * Class PedidoNotaController
 * @package App\Http\Controllers\Pedido
 */
class PedidoComentarioController extends Controller
{
    use RestControllerTrait;

    const MODEL = PedidoComentario::class;

    protected $validationRules = [];

    /**
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function index()
    {
        $m = self::MODEL;
        return $this->listResponse($m::take(20)->orderBy('created_at', 'desc')->get());
    }

    /**
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function commentsFromOrder($pedido_id)
    {
        $m = self::MODEL;
        return $this->listResponse($m::take(20)->orderBy('created_at', 'desc')->get());
    }

    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function store(Request $request)
    {
        $m = self::MODEL;
        try {
            $v = \Validator::make($request->all(), $this->validationRules);

            if ($v->fails()) {
                throw new \Exception("ValidationException");
            }

            $user = JWTAuth::parseToken()->authenticate()->id;

            $data = $m::create(array_merge(\Request::all(), array('usuario_id' => $user)));
            return $this->createdResponse($data);
        } catch(\Exception $ex) {
            $data = ['form_validations' => $v->errors(), 'exception' => $ex->getMessage()];
            return $this->clientErrorResponse($data);
        }
    }
}
