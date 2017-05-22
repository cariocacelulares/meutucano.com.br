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
        $this->middleware('permission:product_serial_defect_list', ['only' => ['index']]);
        $this->middleware('permission:product_serial_defect_show', ['only' => ['show']]);
        $this->middleware('permission:product_serial_defect_create', ['only' => ['store']]);
        $this->middleware('permission:product_serial_defect_update', ['only' => ['update']]);
        $this->middleware('permission:product_serial_defect_return', ['only' => ['destroy']]);

        $this->middleware('convertJson', ['only' => ['index', 'header']]);
    }

    /**
     * Render list based on filters
     *
     * @return Builder
     */
    public function list()
    {
        return ProductSerialDefect::with([
            'productSerial',
            'productSerial.depotProduct',
            'productSerial.depotProduct.depot',
            'productSerial.depotProduct.product'
        ])
            ->join('product_serials', 'product_serials.id', '=', 'product_serial_defects.product_serial_id')
            ->where(function($query) {
                $query->whereMonth('product_serial_defects.created_at', request('filter.month'))
                    ->whereYear('product_serial_defects.created_at', request('filter.year'));
            });
    }

    /**
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function index()
    {
        $search = request('search');

        $data = $this->list()
            ->where(function($query) use ($search) {
                $query->where('product_serials.serial', 'LIKE', "%{$search}%")
                    ->orWhere('product_serial_defects.description', 'LIKE', "%{$search}%");
            })
            ->select('product_serial_defects.*')
            ->orderBy('created_at', 'DESC')
            ->paginate(
                request('per_page', 10)
            );

        return listResponse($data);
    }

    /**
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function header()
    {
        $data = $this->list()->get();

        $header['defect'] = [
            'quantity' => $data->count(),
            'total'    => $data->sum('productSerial.depotProduct.product.price')
        ];

        return showResponse($header);
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
