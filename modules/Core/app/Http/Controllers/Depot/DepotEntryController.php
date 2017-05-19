<?php namespace Core\Http\Controllers\Depot;

use Carbon\Carbon;
use Core\Models\Supplier;
use Core\Models\DepotEntry;
use Core\Models\DepotEntryInvoice;
use Core\Models\DepotEntryProduct;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Rest\RestControllerTrait;
use Core\Http\Requests\DepotEntryRequest as Request;

class DepotEntryController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:entry_list|entry_list_mine', ['only' => ['index']]);
        $this->middleware('permission:entry_show', ['only' => ['show']]);
        $this->middleware('permission:entry_create', ['only' => ['store']]);
        $this->middleware('permission:entry_update', ['only' => ['update']]);
        $this->middleware('permission:entry_delete', ['only' => ['destroy']]);
        $this->middleware('permission:entry_confirm', ['only' => ['confirm']]);

        $this->middleware('currentUser', ['only' => ['store', 'index']]);
        $this->middleware('convertJson', ['only' => ['index']]);
    }

    /**
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function index()
    {
        $search = request('search');

        $data = DepotEntry::with(['supplier', 'user'])
            ->join('suppliers', 'suppliers.id', '=', 'depot_entries.supplier_id')
            ->where(function($query) {
                if (!\Auth::user()->can('entry_list'))
                    $query->where('depot_entries.user_id', request('user_id'));
            })
            ->where(function($query) use ($search) {
                $query->where('suppliers.taxvat', 'LIKE', "%{$search}%")
                    ->orWhere('suppliers.name', 'LIKE', "%{$search}%");
            })
            ->where(function($query) {
                $query->whereMonth('depot_entries.created_at', request('filter.month'))
                    ->whereYear('depot_entries.created_at', request('filter.year'));
            })
            ->select('depot_entries.*')
            ->paginate(
                request('per_page', 10)
            );

        return listResponse($data);
    }

    /**
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function show($id)
    {
        try {
            $data = DepotEntry::with([
                'supplier',
                'invoice',
                'user',
                'products',
                'products.product',
                'products.depotProduct',
                'products.depotProduct.depot',
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
            \DB::transaction(function() use ($request, &$entry) {
                $entry = DepotEntry::create($request->except(['products']));

                if ($invoiceId = $request->input('invoice')) {
                    $invoice = DepotEntryInvoice::findOrFail($invoiceId);
                    $invoice->depot_entry_id = $entry->id;
                    $invoice->save();
                }

                $this->processEntryProducts($entry, $request->input('products'));
            });

            return createdResponse($entry);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao salvar recurso'));

            return clientErrorResponse([
                'exception' => '[' . $exception->getLine() . ']' . ' ' . $exception->getMessage()
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
            \DB::transaction(function() use ($request, $id, &$entry) {
                $entry = DepotEntry::findOrFail($id);

                if ($entry->confirmed === true) {
                    throw new \Exception("Não é possível realizar alterações em entradas confirmadas.");
                }

                $entry->fill($request->except(['products']));
                $entry->save();

                $this->processEntryProducts($entry, $request->input('products'));
            });

            return showResponse($entry);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao atualizar recurso'));

            return clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * Confirm entry
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function confirm($id)
    {
        try {
            $data = DepotEntry::findOrFail($id);
            $data->confirmed_at = Carbon::now();
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
     * Create/update products from entry
     *
     * @param  DepotEntry $entry
     * @param  array $products
     * @return void
     */
    private function processEntryProducts($entry, $products)
    {
        $entry->products()->delete();

        foreach ($products as $product) {
            if (array_key_exists('variation_title', $product))
                \TitleVariation::set($product['sku'], $product['variation_title']);

            $entryProducts[] = [
                'depot_entry_id'   => $entry->id,
                'product_sku'      => $product['sku'],
                'depot_product_id' => $product['depot_product_id'],
                'quantity'         => $product['quantity'],
                'unitary_value'    => $product['cost'],
                'taxed'            => $product['taxes']['taxed'],
                'icms'             => $product['taxes']['icms'],
                'ipi'              => $product['taxes']['ipi'],
                'pis'              => $product['taxes']['pis'],
                'cofins'           => $product['taxes']['cofins'],
                'serials'          => $product['serials']
            ];
        }

        $entry->products()->createMany($entryProducts);
    }

    /**
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function destroy($id)
    {
        try {
            $data = DepotEntry::findOrFail($id);

            if ($data->confirmed === true) {
                throw new \Exception("Não é possível realizar alterações em entradas confirmadas.");
            }

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
