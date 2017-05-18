<?php namespace Core\Http\Controllers\Supplier;

use Core\Models\Supplier;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Rest\RestControllerTrait;
use Core\Http\Requests\SupplierRequest as Request;

class SupplierController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:supplier_list', ['only' => ['index']]);
        $this->middleware('permission:supplier_show', ['only' => ['show']]);
        $this->middleware('permission:supplier_create', ['only' => ['store']]);
        $this->middleware('permission:supplier_update', ['only' => ['update']]);
        $this->middleware('permission:supplier_delete', ['only' => ['destroy']]);

        $this->middleware('convertJson', ['only' => ['index']]);
    }

    /**
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function index()
    {
        $search = request('search');

        $data = Supplier::orderBy('created_at', 'DESC')
            ->where(function($query) use ($search) {
                $query->where('taxvat', 'LIKE', "%{$search}%")
                    ->orWhere('name', 'LIKE', "%{$search}%");
            })
            ->paginate(
                request('per_page', 10)
            );

        return listResponse($data);
    }

    /**
     * Search suppliers by cnpj
     *
     * @param  string $term
     * @return Object
     */
    public function find($term)
    {
        $supplier = Supplier::where('taxvat', 'LIKE', "%{$term}%")
            ->orwhere('name', 'LIKE', "%{$term}%")
            ->orderBy('created_at', 'DESC')
            ->get();

        return listResponse($supplier);
    }

    /**
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function show($id)
    {
        try {
            $data = Supplier::findOrFail($id);

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
            $data = Supplier::create($request->all());

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
            $data = Supplier::findOrFail($id);
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
            $data = Supplier::findOrFail($id);
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
