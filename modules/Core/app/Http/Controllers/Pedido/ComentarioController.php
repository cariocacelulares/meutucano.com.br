<?php namespace Core\Http\Controllers\Pedido;

use Tymon\JWTAuth\Facades\JWTAuth;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Rest\RestControllerTrait;
use Core\Models\Pedido\Comentario;
use Core\Transformers\CommentTransformer;
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
        $data = (self::MODEL)
            ::where('pedido_id', $pedido_id)
            ->orderBy('created_at', 'desc')
            ->get();

        return $this->listResponse(CommentTransformer::tableList($data));
    }

    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function store(Request $request)
    {
        try {
            $user = getCurrentUserId();
            $data = (self::MODEL)::create(array_merge(\Request::all(), ['usuario_id' => $user]));

            return $this->createdResponse($data);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao salvar recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }
}
