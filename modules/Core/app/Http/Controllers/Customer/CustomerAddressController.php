<?php namespace Core\Http\Controllers\Customer;

use Core\Models\Customer;
use Core\Models\CustomerAddress;
use App\Http\Controllers\Controller;
use Core\Http\Requests\Customer\CustomerAddressRequest as Request;

class CustomerAddressController extends Controller
{

    public function __construct()
    {
        $this->middleware('permission:customer_address_list', ['only' => ['listByCustomer']]);
        $this->middleware('permission:customer_address_show', ['only' => ['show']]);
        $this->middleware('permission:customer_address_create', ['only' => ['store']]);
        $this->middleware('permission:customer_address_update', ['only' => ['update']]);
        $this->middleware('permission:customer_address_delete', ['only' => ['destroy']]);
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
            $data = CustomerAddress::where('customer_id', '=', $customerId)
                ->get();

            return listResponse($data);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao obter recurso'));

            return clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function show($id)
    {
        try {
            $data = CustomerAddress::findOrFail($id);

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
            $data = CustomerAddress::create($request->all());

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
            $data = CustomerAddress::findOrFail($id);
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
            $data = CustomerAddress::findOrFail($id);
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
