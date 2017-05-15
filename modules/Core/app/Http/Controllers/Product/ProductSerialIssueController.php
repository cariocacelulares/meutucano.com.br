<?php namespace Core\Http\Controllers\Product;

use Core\Models\ProductSerial;
use Core\Models\ProductSerialIssue;
use App\Http\Controllers\Controller;
use Core\Http\Controllers\Product\ProductSerialController;
use Core\Http\Requests\ProductSerialIssueRequest as Request;

class ProductSerialIssueController extends Controller
{

    public function __construct()
    {
        $this->middleware('permission:stock_issue_list', ['only' => ['index']]);
        $this->middleware('permission:stock_issue_show', ['only' => ['show']]);
        $this->middleware('permission:stock_issue_create', ['only' => ['store']]);
        $this->middleware('permission:stock_issue_update', ['only' => ['update']]);
        $this->middleware('permission:stock_issue_delete', ['only' => ['destroy']]);

        $this->middleware('currentUser', ['only' => ['store']]);
    }

    /**
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function index()
    {
        $data = ProductSerialIssue::with([
            'user',
            'productSerial',
            'productSerial.depotProduct',
            'productSerial.depotProduct.depot',
            'productSerial.depotProduct.product',
        ])->orderBy('created_at', 'DESC');

        return tableListResponse($data);
    }

    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function store(Request $request)
    {
        try {
            $check = ProductSerialController::checkSerials([$request->input('serial')]);

            if ($check !== true)
                return validationFailResponse([
                    'available' => false,
                    'message'   => $check
                ]);

            $issueSerial = ProductSerial::where('serial', $request->input('serial'))
                ->first();

            $data = new ProductSerialIssue;
            $data->fill($request->except('serial'));

            $data->product_serial_id = $issueSerial->id;
            $data->save();

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
            $data = ProductSerialIssue::findOrFail($id);
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