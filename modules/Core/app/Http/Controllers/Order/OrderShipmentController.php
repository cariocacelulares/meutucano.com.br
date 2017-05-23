<?php namespace Core\Http\Controllers\Order;

use Carbon\Carbon;
use Core\Models\Order;
use Core\Models\OrderShipment;
use App\Http\Controllers\Controller;
use Core\Models\OrderShipmentHistory;
use App\Interfaces\ShipmentApiInterface;
use Core\Http\Requests\Order\OrderShipmentRequest as Request;

class OrderShipmentController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:order_shipment_create', ['only' => ['store']]);
        $this->middleware('permission:order_shipment_update', ['only' => ['update']]);
        $this->middleware('permission:order_shipment_print', ['only' => ['label']]);
        $this->middleware('permission:order_shipment_important_list', ['only' => ['important']]);

        $this->middleware('convertJson', ['only' => 'important']);
    }

    /**
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function important()
    {
        $data = OrderShipment::with(['order', 'order.customer', 'order.customerAddress'])
            ->whereIn('status', [OrderShipment::STATUS_LATE, OrderShipment::STATUS_LOSS])
            // ->where(function($query) {
            //     $query->whereDoesntHave('pi')
            //         ->orWhereHas('pi', function($query) {
            //             $query->where('');
            //         });
            // })
            ->orderBy('created_at', 'DESC')
            ->paginate(
                request('per_page', 10)
            );

        return listResponse($data);
    }

    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function store(Request $request)
    {
        try {
            $data = OrderShipment::create($request->all());

            return createdResponse($data);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao salvar recurso'));

            return clientErrorResponse(['exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()]);
        }
    }

    /**
     * Fetch and saves current history from shipment
     * @param  OrderShipment $orderShipment
     * @return OrderShipment
     */
    private function refreshHistory($orderShipment)
    {
        $shipmentHistory = shipment($orderShipment)->history();

        $orderShipment->history()->delete();

        foreach ($shipmentHistory as $event) {
            $orderShipment->history()->save(new OrderShipmentHistory($event));
        }

        return $orderShipment->fresh();
    }

    /**
     * Refresh status and history from shipment
     *
     * @param  OrderShipment $orderShipment
     * @return OrderShipment
     */
    private function refreshHistoryAndStatus($orderShipment)
    {
        $orderShipment = $this->refreshHistory($orderShipment);

        $orderShipment->status = shipment($orderShipment)->refreshStatus();

        if ($orderShipment->isDirty('status') && ($orderShipment->getOriginal('status') == OrderShipment::STATUS_PENDING)) {
            $orderShipment->order->status = Order::STATUS_SHIPPED;
            $orderShipment->order->save();

            $firstEvent = $orderShipment->history->last()->toArray();
            $orderShipment->sent_at = Carbon::createFromFormat('Y-m-d H:i:s', $firstEvent['date'])->format('Y-m-d');
        }

        $orderShipment->save();

        return $orderShipment;
    }

    /**
     * Refresh status from one order shipment
     *
     * @param integer $orderShipmentId
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function refresh($orderShipmentId)
    {
        try {
            $orderShipment = OrderShipment::findOrFail($orderShipmentId);
            $orderShipment = $this->refreshHistoryAndStatus($orderShipment);

            return showResponse($orderShipment);
        } catch (\Exception $exception) {
            return clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * Return the history of status from shipment
     *
     * @param array|string $codigos
     * @return array
     */
    public function history($orderShipmentId)
    {
        try {
            $orderShipment   = OrderShipment::findOrFail($orderShipmentId);

            if ($orderShipment->history->isEmpty())
                $orderShipment = $this->refreshHistory($orderShipment);

            return showResponse($orderShipment->history);
        } catch (\Exception $exception) {
            return clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * Gera o PDF da etiqueta dos correios
     *
     * @param $orderShipmentId
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function label($orderShipmentId)
    {
        $orderShipment = OrderShipment::findOrFail($orderShipmentId);

        return shipment($orderShipment)->printLabel();
    }

    /**
     * Refresh all available order shipments
     *
     * @return void
     */
    public static function refreshAll()
    {
        $orderShipments = OrderShipment::whereIn('status', [
            OrderShipment::STATUS_PENDING,
            OrderShipment::STATUS_NORMAL
        ])->get();

        foreach ($orderShipments as $orderShipment) {
            $this->refreshHistoryAndStatus($orderShipment);
        }
    }

    /**
     * Set order shipment deadline
     *
     * @param integer $orderShipmentId
     * @return void
     */
    public static function calculateDeadline($orderShipmentId)
    {
        $orderShipment = OrderShipment::findOrFail($orderShipmentId);
        $orderShipment->deadline = shipment($orderShipment)->calculateDeadline();
        $orderShipment->save();
    }
}
