<?php namespace Core\Http\Controllers\Customer;

use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use Core\Models\Customer;
use Core\Models\CustomerAddress;
use Core\Transformers\ClientTransformer;
use Core\Http\Requests\CustomerRequest as Request;

class CustomerController extends Controller
{
    use RestControllerTrait;

    const MODEL = Customer::class;

    public function __construct()
    {
        $this->middleware('permission:customer_list', ['only' => ['index']]);
        $this->middleware('permission:customer_show', ['only' => ['show']]);
        $this->middleware('permission:customer_create', ['only' => ['store']]);
        $this->middleware('permission:customer_update', ['only' => ['update']]);
        $this->middleware('permission:customer_delete', ['only' => ['destroy']]);
    }

    /**
     * List all customers
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function index()
    {
        $customers = Customer::orderBy('created_at', 'DESC');
        $customers = $this->handleRequest($customers);

        return $this->listResponse($customers);
    }

    /**
     * Show details from customer
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function show($id)
    {
        try {
            return $this->showResponse(Customer::with(['pedidos', 'addresses'])->findOrFail($id));
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao obter recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * Search customers
     *
     * @param  string $term
     * @return Object
     */
    public function search($term)
    {
        try {
            $customers = Customer::with('enderecos')
                ->where('name', 'LIKE', "%{$term}%")
                ->orWhere('taxvat', 'LIKE', "%{$term}%")
                ->get();

            return $this->listResponse(ClientTransformer::directSearch($customers));
        } catch (\Exception $exception) {
            return $this->listResponse([]);
        }
    }
}
