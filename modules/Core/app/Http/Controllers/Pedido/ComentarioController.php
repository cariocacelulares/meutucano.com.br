<?php namespace Core\Http\Controllers\Pedido;

use Tymon\JWTAuth\Facades\JWTAuth;
use Core\Models\Pedido\Comentario;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Rest\RestControllerTrait;
use Core\Http\Requests\ComentarioRequest as Request;
use Core\Transformers\CommentTransformer;

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
        $data = (self::MODEL)
            ::where('pedido_id', $pedido_id)
            ->orderBy('created_at', 'desc')
            ->get();

        return $this->listResponse(CommentTransformer::list($data));
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
