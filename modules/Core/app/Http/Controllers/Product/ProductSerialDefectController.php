<?php namespace Core\Http\Controllers\Product;

use Core\Models\ProductSerial;
use Core\Models\ProductSerialDefect;
use App\Http\Controllers\Controller;
use Core\Http\Controllers\Product\ProductSerialController;
use Core\Http\Requests\ProductSerialDefectRequest as Request;

class ProductSerialDefectController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:product_defect_list', ['only' => ['index']]);
        $this->middleware('permission:product_defect_show', ['only' => ['show']]);
        $this->middleware('permission:product_defect_create', ['only' => ['store']]);
        $this->middleware('permission:product_defect_update', ['only' => ['update']]);
        $this->middleware('permission:product_defect_return', ['only' => ['destroy']]);
    }

    /**
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function index()
    {
        $data = ProductSerialDefect::with(['productSerial'])
            ->orderBy('created_at', 'DESC');

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

            $data = new ProductSerialDefect;
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
            $data = ProductSerialDefect::findOrFail($id);
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