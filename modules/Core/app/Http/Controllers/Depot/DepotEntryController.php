<?php namespace Core\Http\Controllers\Depot;

use Carbon\Carbon;
use Core\Models\Supplier;
use Core\Models\DepotEntry;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Rest\RestControllerTrait;

class DepotEntryController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:entry_list', ['only' => ['index']]);
        $this->middleware('permission:entry_show', ['only' => ['show']]);
        $this->middleware('permission:entry_create', ['only' => ['store']]);
        $this->middleware('permission:entry_update', ['only' => ['update']]);
        $this->middleware('permission:entry_delete', ['only' => ['destroy']]);
        $this->middleware('permission:entry_confirm', ['only' => ['confirm']]);
    }

    /**
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function index()
    {
        $data = DepotEntry::with(['supplier', 'user'])
            ->orderBy('created_at', 'DESC');

        return tableListResponse($data);
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
     * Returns a unique resource
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function show($id)
    {
        try {
            $entry = DepotEntry::with([
                'supplier',
                'invoice',
                'user',
                'products',
                'products.product',
                'products.product.productStocks',
                'products.product.productStocks.stock',
                'products.productStock',
                'products.productStock.stock',
            ])->findOrFail($id);

            return $this->showResponse(DepotEntryTransformer::show($entry));
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao obter recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * Create a new resource
     *
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function store()
    {
        try {
            $userId      = Input::get('user_id') ?: getCurrentUserId();
            $supplier    = Input::get('supplier');
            $invoice     = Input::get('invoice');
            $products    = Input::get('products') ?: [];
            $description = Input::get('description');

            // Abre um transaction no banco de dados
            \DB::beginTransaction();
            \Log::debug('Transaction - begin');

            $supplier = $this->importSupplier($supplier);

            $entry = DepotEntry::create([
                'description'  => $description,
                'confirmed_at' => null,
                'user_id'      => $userId,
                'supplier_id'  => $supplier ? $supplier->id : null,
            ]);

            $invoice  = $this->importInvoice($invoice, $entry->id);
            $products = $this->importProducts($products, $entry->id);

            // Fecha a transação e comita as alterações
            \DB::commit();
            \Log::debug('Transaction - commit');

            return $this->createdResponse($entry);
        } catch (\Exception $exception) {
            \DB::rollBack();
            \Log::debug('Transaction - rollback');

            \Log::error(logMessage($exception, 'Erro ao salvar recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse([
                'exception' => '[' . $exception->getLine() . ']' . ' ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * Update a resource
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function update($id)
    {
        try {
            $userId      = Input::get('user_id') ?: getCurrentUserId();
            $supplier    = Input::get('supplier');
            $invoice     = Input::get('invoice');
            $products    = Input::get('products');
            $description = Input::get('description');
            $confirm     = Input::get('confirm');

            if (!$invoice) {
                $this->middleware('permission:entry_manual');
            }

            // Abre um transaction no banco de dados
            \DB::beginTransaction();
            \Log::debug('Transaction - begin');

            $supplier = $this->importSupplier($supplier);

            $entry = DepotEntry::findOrFail($id);
            $entry->description  = $description;
            $entry->confirmed_at = $confirm ? Carbon::now() : null;
            $entry->user_id      = $userId;
            $entry->supplier_id  = $supplier ? $supplier->id : null;
            $entry->save();

            $invoice  = $this->importInvoice($invoice, $entry->id);
            $products = $this->importProducts($products, $entry->id);

            // Fecha a transação e comita as alterações
            \DB::commit();
            \Log::debug('Transaction - commit');

            return $this->showResponse($entry);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao atualizar recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * Check if exists and saves invoice
     *
     * @param  array $invoiceData
     * @param  int $entryId
     * @return Invoice
     */
    private function importInvoice($invoiceData, $entryId)
    {
        if (!$invoiceData) {
            return null;
        }

        $invoice = null;

        if (isset($invoiceData['id'])) {
            $invoice = Invoice::find($invoiceData['id']);
        }

        $invoice = $invoice ?: new Invoice;

        $invoice->stock_entry_id = $entryId;
        $invoice->key            = $invoiceData['key'];
        $invoice->series         = $invoiceData['series'];
        $invoice->number         = $invoiceData['number'];
        $invoice->model          = $invoiceData['model'];
        $invoice->cfop           = $invoiceData['cfop'];
        $invoice->total          = $invoiceData['total'];
        $invoice->file           = $invoiceData['file'];
        $invoice->emission       = dateConvert($invoiceData['emission'], 'd/m/Y H:i:s', 'Y-m-d H:i:s');

        return $invoice->save() ? $invoice : null;
    }

    /**
     * Import products from entry
     *
     * @param  array $products
     * @param  int $entryId
     * @return array
     */
    private function importProducts($products, $entryId)
    {
        $return = [];
        foreach ($products as $productData) {
            if (!isset($productData['product_sku']) || !$productData['product_sku']) {
                continue;
            }

            if (isset($productData['title']) && is_null(\TitleVariation::get($productData['title'], $productData['ean']))) {
                \TitleVariation::set($productData['product_sku'], $productData['title'], $productData['ean']);
            }

            $product = null;

            if (isset($productData['id'])) {
                $product = Product::find($productData['id']);
            }

            $product = $product ?: new Product;

            if (isset($productData['imeis'])) {
                $imeis = json_encode(explode(PHP_EOL, $productData['imeis']));
            } else {
                $imeis = null;
            }

            $product->stock_entry_id   = $entryId;
            $product->product_sku      = $productData['product_sku'];
            $product->product_stock_id = $productData['product_stock_id'];
            $product->quantity         = $productData['quantity'];
            $product->unitary_value    = $productData['unitary_value'];
            $product->total_value      = $productData['total_value'];
            $product->icms             = $productData['icms'];
            $product->ipi              = $productData['ipi'];
            $product->pis              = $productData['pis'];
            $product->cofins           = $productData['cofins'];
            $product->imeis            = $imeis;

            $product->save();

            $return[] = $product;
        }

        return $return;
    }

    /**
     * Check if exists and saves supplier
     *
     * @param  array $supplierData
     * @return Supplier
     */
    private function importSupplier($supplierData)
    {
        $supplier = null;

        if (isset($supplierData['id'])) {
            $supplier = Supplier::find($supplierData['id']);
        }

        if (!$supplier) {
            $supplier = Supplier::firstOrNew([
                'cnpj' => $supplierData['cnpj'],
            ]);
        }

        $supplier->company_name = $supplierData['company_name'];
        $supplier->name         = $supplierData['name'];
        $supplier->cnpj         = $supplierData['cnpj'];
        $supplier->ie           = $supplierData['ie'];
        $supplier->crt          = $supplierData['crt'];
        $supplier->fone         = $supplierData['fone'];
        $supplier->street       = $supplierData['street'];
        $supplier->number       = $supplierData['number'];
        $supplier->complement   = $supplierData['complement'];
        $supplier->neighborhood = $supplierData['neighborhood'];
        $supplier->city         = $supplierData['city'];
        $supplier->uf           = $supplierData['uf'];
        $supplier->cep          = $supplierData['cep'];
        $supplier->country      = $supplierData['country'];

        return $supplier->save() ? $supplier : null;
    }
}
