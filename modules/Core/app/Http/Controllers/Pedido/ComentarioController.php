<?php namespace Core\Http\Controllers\Pedido;

use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use Core\Models\Pedido\Comentario;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

/**
 * Class ComentarioController
 * @package Core\Http\Controllers\Pedido
 */
class ComentarioController extends Controller
{
    use RestControllerTrait;

    const MODEL = Comentario::class;

    protected $validationRules = [];

    /**
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function commentsFromOrder($pedido_id)
    {
        $m = self::MODEL;
        return $this->listResponse($m::where('pedido_id', $pedido_id)->orderBy('created_at', 'desc')->get());
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

            $user = getCurrentUserId();

            $data = $m::create(array_merge(\Request::all(), ['usuario_id' => $user]));
            return $this->createdResponse($data);
        } catch(\Exception $ex) {
            $data = ['form_validations' => $v->errors(), 'exception' => $ex->getMessage()];
            return $this->clientErrorResponse($data);
        }
    }
}