<?php namespace Core\Http\Controllers\Order;

use Carbon\Carbon;
use Core\Models\Order;
use Core\Models\OrderInvoice;
use Core\Models\OrderProduct;
use Core\Models\ProductSerial;
use Core\Models\DepotWithdraw;
use App\Http\Controllers\Controller;
use Core\Models\DepotWithdrawProduct;
use Core\Http\Controllers\OrderController;
use Core\Http\Requests\InvoiceRequest as Request;
use Core\Http\Requests\InvoiceDeleteRequest as DeleteRequest;

class OrderInvoiceController extends Controller
{

    public function __construct()
    {
        $this->middleware('permission:order_invoice_create')->only(['store']);
        $this->middleware('permission:order_invoice_delete')->only(['destroy']);
        $this->middleware('permission:order_invoice_print')->only(['danfe']);

        $this->middleware('currentUser')->only(['store']);
        $this->middleware('convertJson')->only(['store']);
    }

    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function store(Request $request)
    {
        try {
            $this->checkUpload($request->input('order_id'), $request->file('file'));

            if (OrderInvoice::where('order_id', $request->input('order_id'))->first())
                throw new \Exception("O pedido já possui nota fiscal associada, delete-a ou crie uma recompra");

            \DB::transaction(function() use ($request, &$data) {
                $data = OrderInvoice::create($request->all());

                $data->order->status = Order::STATUS_PAID;
                $data->order->save();

                $products = collect($request->input('products'));
                $invoiceSerials = ProductSerial::with(['depotProduct', 'withdrawProducts'])
                    ->whereHas('withdrawProducts', function($query) {
                        $query->where('status', DepotWithdrawProduct::STATUS_CONFIRMED);
                    })
                    ->whereIn('serial', $products->pluck('serial'))
                    ->get();

                $orderProducts = OrderProduct::with('product')
                    ->whereIn('id', $products->pluck('order_product_id'))
                    ->get();

                if($products->count() != $invoiceSerials->count())
                    throw new \Exception("Um ou mais seriais faturados não estão confirmados em uma retirada de estoque.");

                if($orderProducts->pluck('order_id')->diff($request->input('order_id'))->count() || $orderProducts->count() === 0)
                    throw new \Exception("Produto não existe ou pertence a esse pedido.");

                foreach ($products as $product) {
                    $orderProduct    = $orderProducts->where('id', $product->order_product_id)->first();
                    $productSerial   = $invoiceSerials->where('serial', $product->serial)->first();

                    $productSerial->cost = $orderProduct->product->cost;
                    $productSerial->save();

                    $withdrawProduct = $productSerial->withdrawProducts->first();

                    $withdrawProduct->status = DepotWithdrawProduct::STATUS_INVOICED;
                    $withdrawProduct->save();

                    $orderProduct->product_serial_id = $productSerial->id;
                    $orderProduct->depot_product_id = $productSerial->depotProduct->id;
                    $orderProduct->save();
                }
            });

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
            \DB::transaction(function() use ($id, $request) {
                $data = OrderInvoice::with([
                    'invoice',
                    'order',
                    'order.orderProducts',
                    'order.orderProducts.depotProduct',
                    'order.orderProducts.productSerial',
                ])->findOrFail($id);

                if ($data->invoice->issued_at->diffInDays(Carbon::now()) > 0)
                    throw new \Exception("Não é possível deletar notas fiscais após 24h de sua emissão.");

                if ($data->order->status !== Order::STATUS_INVOICED)
                    throw new \Exception("Não é possível deletar notas fiscais de pedidos que já foram despachados.");

                $data->fill($request->all());
                $data->save();
                $data->delete();

                $data->order->status = Order::STATUS_PAID;
                $data->order->save();

                foreach ($data->order->orderProducts as $orderProduct) {
                    $orderProduct->fill([
                        'product_serial_id' => null,
                        'depot_product_id'  => null
                    ])->save();

                    $depotWithdraw = DepotWithdraw::with('products')->firstOrCreate([
                        'user_id'    => \Auth::user()->id,
                        'closed_at'  => null,
                        'depot_slug' => $orderProduct->depotProduct->depot_slug
                    ]);

                    $depotWithdraw->products()->updateOrCreate([
                        'depot_product_id'  => $orderProduct->depotProduct->id,
                        'product_serial_id' => $orderProduct->productSerial->id
                    ], [
                        'status' => DepotWithdrawProduct::STATUS_CONFIRMED
                    ]);
                }
            });

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
    private function checkUpload($orderId, $file)
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
        $orderProducts = $order->orderProducts;
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
}
