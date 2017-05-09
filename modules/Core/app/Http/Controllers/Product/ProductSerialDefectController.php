<?php namespace Core\Http\Controllers\Product;

use Core\Models\ProductSerialDefect;
use Core\Models\ProductSerial;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Input;
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
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function show($id)
    {
        try {
            $data = ProductSerialDefect::findOrFail($id);

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
            $data = ProductSerialDefect::create($request->all());

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
            $data = Brand::findOrFail($id);
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
