<?php namespace Core\Http\Controllers\Order;

use Core\Models\OrderComment;
use App\Http\Controllers\Controller;
use Core\Http\Requests\OrderCommentRequest as Request;

class OrderCommentController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:order_comment_list', ['only' => ['commentsFromOrder']]);
        $this->middleware('permission:order_comment_create', ['only' => ['store']]);
        $this->middleware('permission:order_comment_delete', ['only' => ['destroy']]);

        $this->middleware('currentUser', ['only' => 'store']);
    }

    /**
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function listByOrder($order_id)
    {
        $data = OrderComment::where('order_id', $order_id)
            ->orderBy('created_at', 'desc')
            ->get();

        return listResponse($data);
    }

    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function store(Request $request)
    {
        try {
            $data = OrderComment::create($request->all());

            return createdResponse($data);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao salvar recurso'));

            return clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function destroy($id)
    {
        try {
            $data = OrderComment::findOrFail($id);
            $data->delete();

            return deletedResponse();
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao excluir recurso'));

            return clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }
}
