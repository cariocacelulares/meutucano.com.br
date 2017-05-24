<?php namespace Core\Http\Controllers\Depot;

use Core\Models\Product;
use Core\Models\Supplier;
use Core\Models\DepotEntryInvoice;
use App\Http\Controllers\Controller;
use Core\Http\Requests\InvoiceRequest as Request;

class DepotEntryInvoiceController extends Controller
{

    public function __construct()
    {
        $this->middleware('permission:entry_create')->only(['store', 'parse']);
        $this->middleware('permission:entry_show')->only(['danfe']);

        $this->middleware('currentUser')->only(['store']);
    }

    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function store(Request $request)
    {
        try {
            $this->processUpload($request->file('file'));

            $data = DepotEntryInvoice::create($request->all());

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
            $data = DepotEntryInvoice::findOrFail($id);
            $data->delete();

            return deletedResponse();
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao excluir recurso'));

            return clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * Generate DANFe PDF from invoice xml
     *
     * @param  $id
     * @param  string  $returnType I-borwser, S-retorna o arquivo, D-força download, F-salva em arquivo local
     * @param  string  $dir        path dir i $returnType is F
     * @return Response
     */
    public function danfe($id, $returnType = 'I', $path = false)
    {
        $invoice = DepotEntryInvoice::findOrFail($id);

        return \Invoice::danfe($invoice->getAttributes()['file'], $returnType, $path);
    }

    /**
     * Process upload from invoice xml
     *
     * @param  File $file
     * @return boolean
     */
    private function processUpload($file)
    {
        $nfe = \Invoice::validateNfeUpload($file->getRealPath(), config('core.notas.venda'));

        return true;
    }

    /**
     * Read invoice file and return information to entry
     *
     * @param  int $id
     * @return array
     */
    public function parse($id)
    {
        $invoice = DepotEntryInvoice::findOrFail($id);

        $filePath = storage_path('app/public/nota/' . $invoice->getAttributes()['file']);
        $xml = simplexml_load_file($filePath);

        $nfe = $xml->NFe->infNFe;

        /**
         * Supplier
         */
        $supplier = Supplier::where('taxvat', $nfe->emit->CNPJ)->first();

        /**
         * Products
         */
        $nfeProducts = (sizeof($nfe->det) > 1) ? $nfe->det : [$nfe->det];
        foreach ($nfeProducts as $product) {
            $xmlProducts[] = $product;
        }

        $titles = array_map('strval', collect($xmlProducts)->pluck('prod.xProd')
            ->toArray());

        $titleVariations = \TitleVariation::get($titles);
        $variationSkus = $titleVariations->pluck('product_sku')->toArray();
        $availableDepots = \Stock::getObjects($variationSkus);

        foreach ($nfeProducts as $product) {
            $sku = $stocks = $depotProduct = null;

            $productTitle = (string) $product->prod->xProd;
            $ean          = (string) $product->prod->cEAN;

            $titleVariation = $titleVariations->where('title', $productTitle)->first();
            if ($titleVariation) {
                $sku          = $titleVariation->product_sku;
                $stocks       = $availableDepots->where('product_sku', $sku);
                $depotProduct = $stocks->where('depot_slug', 'default')->first();
            }

            $products[] = [
                "sku"              => $sku,
                "variation_title"  => $productTitle,
                "depot_products"   => $stocks,
    			"depot_product_id" => $depotProduct ? $depotProduct->id : null,
    			"cost"             => (float) $product->prod->vUnCom,
    			"quantity"         => (int) $product->prod->qCom,
    			"taxes" => [
    				"taxed"  => true,
    				"icms"   => (float) $product->imposto->ICMS->ICMS20->pICMS,
    				"pis"    => (float) $product->imposto->PIS->PISAliq->pPIS,
    				"ipi"    => (float) $product->imposto->IPI->IPITrib->pIPI,
    				"cofins" => (float) $product->imposto->COFINS->COFINSAliq->pCOFINS
    			]
            ];
        }

        return showResponse([
            'invoice' => $invoice,
            'supplier' => $supplier,
            'products' => $products
        ]);
    }
}
