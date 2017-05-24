<?php namespace Core\Http\Controllers\Order;

use Carbon\Carbon;
use Core\Models\OrderShipment;
use App\Http\Controllers\Controller;
use Core\Models\OrderShipmentLogistic;
use Core\Http\Requests\Order\OrderShipmentLogisticRequest as Request;

class OrderShipmentLogisticController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:order_shipment_logistic_show')->only(['show']);
        $this->middleware('permission:order_shipment_logistic_create')->only(['store']);
        $this->middleware('permission:order_shipment_logistic_update')->only(['update']);
        $this->middleware('permission:order_shipment_logistic_delete')->only(['destroy']);
    }

    /**
     * @param  int $id
     * @return array
     */
    public function show($id)
    {
        try {
            $data = OrderShipmentLogistic::findOrFail($id);

            return showResponse($data);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao obter recurso'));

            return clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function store(Request $request)
    {
        try {
            $data = OrderShipmentLogistic::create($request->all());


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
    public function update(Request $request, $id)
    {
        try {
            $data = OrderShipmentLogistic::findOrFail($id);
            $data->fill($request->all());
            $data->save();

            return showResponse($data);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao atualizar recurso'));

            return clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * Mark logistic as received
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function received($id)
    {
        try {
            \DB::transaction(function() use ($id, &$data) {
                $data = OrderShipmentLogistic::findOrFail($id);
                $data->received_at = Carbon::now();
                $data->save();

                $data->orderShipment->status = OrderShipment::STATUS_RETURNED;
                $data->orderShipment->save();
            });

            return showResponse($data);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao atualizar recurso'));

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
            $data = OrderShipmentLogistic::findOrFail($id);
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
