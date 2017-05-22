<?php namespace Core\Http\Controllers\Order;

use Carbon\Carbon;
use Core\Models\Order;
use Core\Models\Product;
use Core\Models\OrderInvoice;
use Core\Models\OrderProduct;
use Core\Models\DepotWithdraw;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Core\Models\DepotWithdrawProduct;
use Core\Models\OrderInvoiceDevolution;
use Core\Http\Requests\InvoiceRequest as Request;
use Core\Http\Requests\InvoiceDeleteRequest as DeleteRequest;

class OrderInvoiceDevolutionController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:order_invoice_devolution', ['only' => ['store']]);
        $this->middleware('permission:order_invoice_delete', ['only' => ['destroy']]);
        $this->middleware('permission:order_invoice_print', ['only' => ['danfe']]);

        $this->middleware('currentUser', ['only' => 'store']);
        $this->middleware('convertJson', ['only' => 'store']);
    }

    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function store(Request $request)
    {
        try {
            $this->checkUpload($request->input('order_invoice_id'),
                $request->file('file'), $request->input('serials'));

            $data = OrderInvoiceDevolution::create($request->all());

            $this->proceedDevolution($data->id,
                $request->input('order_invoice_id'),
                $request->input('serials'));

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
     * Generate DANFe PDF file
     *
     * @param  $id
     * @param  string  $returnType I-borwser, S-retorna o arquivo, D-força download, F-salva em arquivo local
     * @param  string  $dir        path dir i $returnType is F
     * @return Response
     */
    public function danfe($id, $returnType = 'I', $path = false)
    {
        $invoice = OrderInvoiceDevolution::findOrFail($id);

        return \Invoice::danfe($invoice->getAttributes()['file'], $returnType, $path);
    }

    /**
     * Proceed with upload (created defects and change order status)
     *
     * @param  int  $id OrderInvoiceDevolution
     * @return Response
     */
    private function proceedDevolution($invoiceDevolutionId, $invoiceId, $serials)
    {
        $invoice = OrderInvoice::findOrFail($invoiceId);
        $orderId = $invoice->order_id;

        $orderProducts = OrderProduct::with(['productSerial', 'productSerial.depotProduct'])
            ->join('product_serials', 'product_serials.id', '=', 'order_products.product_serial_id')
            ->whereIn('product_serials.serial', $serials)
            ->where('order_products.order_id', $orderId)
            ->where('order_products.order_invoice_devolution_id', null)
            ->select('order_products.*')
            ->get();

        $withdraw = DepotWithdraw::continuous()->open()->firstOrCreate([
            'user_id'       => request('user_id'),
            'is_continuous' => true
        ]);

        foreach ($orderProducts as $orderProduct) {
            $orderProduct->order_invoice_devolution_id = $invoiceDevolutionId;
            $orderProduct->returned_at                 = Carbon::now();
            $orderProduct->save();

            DepotWithdrawProduct::create([
                'depot_withdraw_id' => $withdraw->id,
                'depot_product_id'  => $orderProduct->productSerial->depotProduct->id,
                'product_serial_id' => $orderProduct->productSerial->id,
                'status'            => DepotWithdrawProduct::STATUS_CONFIRMED
            ]);
        }

        $orderProducts = OrderProduct::where('order_id', $orderId)->get();

        if (!$orderProducts->contains('order_invoice_devolution_id', null)) {
            $invoice->order->update(['status' => Order::STATUS_RETURNED]);
        }
    }

    /**
     * Process upload from invoice xml
     *
     * @param  int $invoiceId
     * @param  File $file
     * @return boolean
     */
    private function checkUpload($invoiceId, $file, $serials)
    {
        $nfe = \Invoice::validateNfeUpload($file->getRealPath(), config('core.notas.devolucao'));

        /**
         * Verify customer
         */
        $order = OrderInvoice::findOrFail($invoiceId)->order;
        $taxvat = ($nfe->dest->CPF) ?: $nfe->dest->CNPJ;

        if (!strstr($taxvat, $order->customer->taxvat)) {
            throw new \Exception('O documento do cliente da nota fiscal não bate com o do pedido.');
        }

        /**
         * Verify products
         */
        $nfeProducts = (sizeof($nfe->det) > 1) ? $nfe->det : [$nfe->det];
        $orderProducts = $order->products;

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
                ->where('order_invoice_devolution_id', null)
                ->where('price', $product['price'])
                ->count();

            if ($count != $product['qty'])
                throw new \Exception("Verifique o preço e quantidade devolvida do SKU {$sku}.");
        }

        foreach ($serials as $serial) {
            $orderProduct = OrderProduct::with('productSerial')
                ->join('product_serials', 'product_serials.id', '=', 'order_products.product_serial_id')
                ->where('product_serials.serial', $serial)
                ->where('order_products.order_id', $order->id)
                ->where('order_products.order_invoice_devolution_id', null)
                ->first();

            if (!$orderProduct)
                throw new \Exception("O serial {$serial} não pertence a esse pedido ou já foi devolvido.");
        }

        return true;
    }
}
