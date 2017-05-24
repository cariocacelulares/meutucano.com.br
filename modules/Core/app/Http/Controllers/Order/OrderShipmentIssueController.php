<?php namespace Core\Http\Controllers\Order;

use Core\Models\OrderShipmentIssue;
use App\Http\Controllers\Controller;
use Core\Http\Requests\Order\OrderShipmentIssueRequest as Request;

class OrderShipmentIssueController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:order_shipment_issue_list')->only(['index']);
        $this->middleware('permission:order_shipment_issue_show')->only(['show']);
        $this->middleware('permission:order_shipment_issue_create')->only(['store']);
        $this->middleware('permission:order_shipment_issue_update')->only(['update']);
        $this->middleware('permission:order_shipment_issue_delete')->only(['destroy']);
    }

    /**
     * @param  int $id
     * @return array
     */
    public function show($id)
    {
        try {
            $data = OrderShipmentIssue::findOrFail($id);

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
            $data = OrderShipmentIssue::create($request->all());


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
            $data = OrderShipmentIssue::findOrFail($id);
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
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function destroy($id)
    {
        try {
            $data = OrderShipmentIssue::findOrFail($id);
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
