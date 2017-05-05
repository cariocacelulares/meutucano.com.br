<?php namespace Core\Http\Controllers\Order;

use Core\Models\Order;
use Core\Models\OrderInvoice;
use App\Http\Controllers\Controller;
use Core\Http\Controllers\OrderController;
use Core\Http\Requests\InvoiceRequest as Request;
use Core\Http\Requests\InvoiceDeleteRequest as DeleteRequest;

class OrderInvoiceController extends Controller
{

    public function __construct()
    {
        $this->middleware('permission:order_invoice_create', ['only' => ['store']]);
        $this->middleware('permission:order_invoice_delete', ['only' => ['destroy']]);
        $this->middleware('permission:order_invoice_print', ['only' => ['danfe']]);

        $this->middleware('currentUser', ['only' => 'store']);
    }

    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function store(Request $request)
    {
        try {
            $this->processUpload($request->input('order_id'), $request->file('file'));

            $data = OrderInvoice::create($request->all());

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
    public function destroy($id, DeleteRequest $request)
    {
        try {
            $data = OrderInvoice::findOrFail($id);
            $data->fill($request->all());
            $data->save();
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
        $invoice = OrderInvoice::findOrFail($id);

        return \Invoice::danfe($invoice->getAttributes()['file'], $returnType, $path);
    }

    /**
     * Process upload from invoice xml
     *
     * @param  int $invoiceId
     * @param  File $file
     * @return boolean
     */
    private function processUpload($orderId, $file)
    {
        $nfe = \Invoice::validateNfeUpload($file->getRealPath(), config('core.notas.venda'));

        /**
         * Verify customer
         */
        $order = Order::findOrFail($orderId);
        $taxvat = ($nfe->dest->CPF) ?: $nfe->dest->CNPJ;

        if (!strstr($taxvat, $order->customer->taxvat)) {
            throw new \Exception('O documento do cliente da nota fiscal não bate com o do pedido.');
        }

        /**
         * Verify products
         */
        $nfeProducts = (sizeof($nfe->det) > 1) ? $nfe->det : [$nfe->det];
        $orderProducts = $order->products;
        if ($orderProducts->count() != sizeof($nfeProducts)) {
            throw new \Exception("A nota fiscal não possui os mesmos produtos que no pedido.");
        }

        $nfeProductsClean = [];
        foreach ($nfeProducts as $product) {
            $sku = (int) $product->prod->cProd;
            $qty = (int) $product->prod->qCom;

            $nfeProductsClean[$sku] = [
                'qty'   => isset($nfeProductsClean[$sku]) ? ($qty + $nfeProductsClean[$sku]['qty']) : $qty,
                'price' => (float) $product->prod->vUnCom,
            ];
        }

        foreach ($nfeProductsClean as $sku => $product) {
            $count = $orderProducts->where('product_sku', $sku)
                ->where('price', $product['price'])
                ->count();

            if ($count != $product['qty'])
                throw new \Exception("Verifique o preço e quantidade do SKU {$sku}.");
        }

        return true;
    }

    //
    // /**
    //  *
    //  *
    //  * @param $id
    //  * @return \Symfony\Component\HttpFoundation\Response
    //  */
    // public function invoice($pedido_id)
    // {
    //     return with(new PedidoController())->faturar($pedido_id);
    // }
}
