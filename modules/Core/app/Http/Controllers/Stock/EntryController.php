<?php namespace Core\Http\Controllers\Stock;

use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use Core\Models\Stock\Entry;
use Core\Models\Stock\Entry\Invoice;
use Core\Models\Stock\Entry\Product;
use Core\Models\Supplier;

/**
 * Class EntryController
 * @package Core\Http\Controllers\Stock
 */
class EntryController extends Controller
{
    use RestControllerTrait;

    const MODEL = Entry::class;

    /**
     * Lista para a tabela
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function tableList()
    {
        $list = (self::MODEL)
            ::orderBy('created_at', 'DESC');

        $list = $this->handleRequest($list);

        return $this->listResponse($list);
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
            $supplier    = Input::get('supplier');
            $invoice     = Input::get('invoice');
            $products    = Input::get('products');
            $description = Input::get('description');

            // Abre um transaction no banco de dados
            \DB::beginTransaction();
            \Log::debug('Transaction - begin');

            $supplier = $this->importSupplier($supplier);

            $entry = (self::MODEL)
                ::create([
                    'description'  => $description,
                    'confirmed_at' => null,
                    'user_id'      => getCurrentUserId(),
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
     * Check if exists and saves invoice
     *
     * @param  array $invoiceData
     * @param  int $entryId
     * @return Invoice
     */
    private function importInvoice($invoiceData, $entryId)
    {
        $invoice = Invoice::firstOrNew([
            'key' => $invoiceData['key'],
        ]);

        $invoice->stock_entry_id = $entryId;
        $invoice->key            = $invoiceData['key'];
        $invoice->series         = $invoiceData['series'];
        $invoice->number         = $invoiceData['number'];
        $invoice->model          = $invoiceData['model'];
        $invoice->cfop           = $invoiceData['cfop'];
        $invoice->total          = $invoiceData['total'];
        $invoice->file           = $invoiceData['file'];
        $invoice->emission       = $invoiceData['emission'];

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
        foreach ($products as $product) {
            $return[] = Product::create([
                'stock_entry_id'             => $entryId,
                'product_sku'                => $product['product_sku'],
                'product_stock_id'           => $product['product_stock_id'],
                'product_title_variation_id' => $product['product_title_variation_id'],
                'quantity'                   => $product['quantity'],
                'unitary_value'              => $product['unitary_value'],
                'total_value'                => $product['total_value'],
                'icms'                       => $product['icms'],
                'ipi'                        => $product['ipi'],
                'pis'                        => $product['pis'],
                'cofins'                     => $product['cofins'],
                'imeis'                      => isset($product['imeis']) ? json_encode($product['imeis']) : null,
            ]);
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
        $supplier = Supplier::firstOrNew([
            'cnpj' => $supplierData['cnpj'],
        ]);

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
