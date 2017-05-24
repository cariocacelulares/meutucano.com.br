<?php namespace Core\Http\Controllers\Customer;

use Core\Models\Customer;
use App\Http\Controllers\Controller;
use Core\Http\Requests\Customer\CustomerRequest as Request;

class CustomerController extends Controller
{

    public function __construct()
    {
        $this->middleware('permission:customer_list')->only(['index']);
        $this->middleware('permission:customer_show')->only(['show']);
        $this->middleware('permission:customer_create')->only(['store']);
        $this->middleware('permission:customer_update')->only(['update']);
        $this->middleware('permission:customer_delete')->only(['destroy']);

        $this->middleware('convertJson')->only(['index']);
    }

    /**
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function index()
    {
        $search = request('search');

        $data = Customer::orderBy('created_at', 'DESC')
            ->where(function($query) use ($search) {
                $query->where('taxvat', 'LIKE', "%{$search}%")
                    ->orWhere('name', 'LIKE', "%{$search}%")
                    ->orWhere('email', 'LIKE', "%{$search}%");
            })
            ->where(function($query) {
                if (request('filter.type'))
                    $query->where('type', request('filter.type'));
            })
            ->paginate(
                request('per_page', 10)
            );

        return listResponse($data);
    }

    /**
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function fetch()
    {
        $search = request('search');

        $data = Customer::where('name', 'LIKE', "%{$search}%")
            ->get();

        return listResponse($data);
    }

    /**
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function show($id)
    {
        try {
            $data = Customer::with([
                'orders',
                'orders.marketplace',
                'addresses'
            ])->findOrFail($id);

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
            $data = Customer::create($request->all());

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
            $data = Customer::findOrFail($id);
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
            $data = Customer::findOrFail($id);
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
