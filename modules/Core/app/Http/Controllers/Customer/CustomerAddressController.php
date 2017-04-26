<?php namespace Core\Http\Controllers\Customer;

use Core\Models\Customer;
use Core\Models\CustomerAddress;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Rest\RestControllerTrait;
use Core\Http\Requests\CustomerAddressRequest as Request;

class CustomerAddressController extends Controller
{
    use RestControllerTrait;

    const MODEL = CustomerAddress::class;

    public function __construct()
    {
        $this->middleware('permission:customer_address_list', ['only' => ['index']]);
        $this->middleware('permission:customer_address_show', ['only' => ['show']]);
        $this->middleware('permission:customer_address_create', ['only' => ['store']]);
        $this->middleware('permission:customer_address_update', ['only' => ['update']]);
        $this->middleware('permission:customer_address_delete', ['only' => ['destroy']]);
    }

    /**
     * Create new address to customer
     *
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function store(Request $request)
    {
        try {
            $address = CustomerAddress::create(Input::all());

            return $this->createdResponse($address);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao salvar recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * Updates an address from customer
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function update($id, Request $request)
    {
        try {
            $address = CustomerAddress::findOrFail($id);
            $address->fill(Input::all());
            $address->save();

            return $this->showResponse($address);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao atualizar recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * Return addresses from customer
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function listByCustomer($customerId)
    {
        try {
            $addresses = CustomerAddress::where('cliente_id', '=', $customerId)
                ->get();

            return $this->listResponse($addresses);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao obter recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }
}
