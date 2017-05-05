<?php namespace Core\Http\Controllers\Order;

use Core\Models\OrderCall;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Input;
use Core\Http\Requests\OrderCallRequest as Request;

class OrderCallController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:order_call_list', ['only' => ['listByOrder']]);
        $this->middleware('permission:order_call_create', ['only' => ['store']]);
        $this->middleware('permission:order_call_delete', ['only' => ['destroy']]);

        $this->middleware('currentUser', ['only' => 'store']);
    }

    /**
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function listByOrder($order_id)
    {
        $data = OrderCall::with('user')
            ->where('order_id', $order_id)
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
            $data = OrderCall::create($request->all());

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
            $data = OrderCall::findOrFail($id);
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
