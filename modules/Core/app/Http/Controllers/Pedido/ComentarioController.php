<?php namespace Core\Http\Controllers\Pedido;

use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use Core\Models\Pedido\Comentario;
use Tymon\JWTAuth\Facades\JWTAuth;
use Core\Http\Requests\ComentarioRequest as Request;

/**
 * Class ComentarioController
 * @package Core\Http\Controllers\Pedido
 */
class ComentarioController extends Controller
{
    use RestControllerTrait;

    const MODEL = Comentario::class;

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
            $user = getCurrentUserId();
            $data = $m::create(array_merge(\Request::all(), ['usuario_id' => $user]));

            return $this->createdResponse($data);
        } catch (\Exception $ex) {
            $data = ['exception' => $ex->getMessage()];
            return $this->clientErrorResponse($data);
        }
    }
}
