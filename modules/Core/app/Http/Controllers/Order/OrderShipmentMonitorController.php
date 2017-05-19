<?php namespace Core\Http\Controllers\Order;

use App\Http\Controllers\Controller;
use Core\Models\OrderShipment;
use Core\Models\OrderShipmentMonitor;
use Core\Http\Requests\Order\OrderShipmentMonitorRequest as Request;

class OrderShipmentMonitorController extends Controller
{

    public function __construct()
    {
        $this->middleware('permission:order_shipment_monitor');
        $this->middleware('currentUser');
    }

    public function index()
    {
        $data = OrderShipmentMonitor::where('user_id', request('user_id'))->get();

        return listResponse($data);
    }

    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function store(Request $request)
    {
        try {
            $data = OrderShipmentMonitor::create($request->all());

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
            $data = OrderShipmentMonitor::findOrFail($id);

            if ($data->user_id !== request('user_id')) {
                throw new \Exception("Não é possível deletar o monitoramento de outro usuário.");
            }

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
