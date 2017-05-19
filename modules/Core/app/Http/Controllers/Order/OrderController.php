<?php namespace Core\Http\Controllers\Order;

use Carbon\Carbon;
use Core\Models\Order;
use Core\Models\Product;
use Core\Models\OrderProduct;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Input;
use Core\Http\Requests\Order\OrderRequest as Request;

class OrderController extends Controller
{

    public function __construct()
    {
        $this->middleware('permission:order_list', ['only' => ['index', 'invoiceable']]);
        $this->middleware('permission:order_show', ['only' => ['show']]);
        $this->middleware('permission:order_create', ['only' => ['store']]);
        $this->middleware('permission:order_update', ['only' => ['update']]);
        $this->middleware('permission:order_delete', ['only' => ['destroy']]);
        $this->middleware('permission:order_prioritize', ['only' => ['prioritize', 'unprioritize']]);
        $this->middleware('permission:order_hold', ['only' => ['hold', 'unhold']]);
        $this->middleware('permission:order_invoice_create', ['only' => ['invoice']]);

        $this->middleware('convertJson', ['only' => ['index', 'important', 'header']]);
    }

    /**
     * Render list based on filters
     *
     * @return Builder
     */
    private function list()
    {
        return Order::with(['customer'])
            ->join('customers', 'customers.id', '=', 'orders.customer_id')
            ->where(function($query) {
                $query->whereMonth('orders.created_at', request('filter.month'))
                    ->whereYear('orders.created_at', request('filter.year'));
            })
            ->select('orders.*');
    }

    /**
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function index()
    {
        $search = request('search');

        $data = $this->list()
            ->where(function($query) use ($search) {
                $query->where('orders.api_code', 'LIKE', "%{$search}%")
                    ->orWhere('customers.name', 'LIKE', "%{$search}%");
            })
            ->orderBy('created_at', 'DESC')
            ->paginate(
                request('per_page', 10)
            );

        return listResponse($data);
    }

    /**
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function header()
    {
        $data = $this->list()->get();

        $canceled = $data->where('status', Order::STATUS_CANCELED);
        $header['canceled'] = [
            'quantity' => $canceled->count(),
            'total'    => $canceled->sum('total')
        ];

        $approved = $data->where('status', Order::STATUS_PAID);
        $header['approved'] = [
            'quantity' => $approved->count(),
            'total'    => $approved->sum('total')
        ];

        $invoiced = $data->whereIn('status', [
            Order::STATUS_INVOICED,
            Order::STATUS_SHIPPED,
            Order::STATUS_COMPLETE
        ]);
        $header['invoiced'] = [
            'quantity' => $invoiced->count(),
            'total'    => $invoiced->sum('total')
        ];

        dd($header);
    }

    /**
     * Return paid orders
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function invoiceable()
    {
        $search = request('search');

        $data = Order::with(['customer'])
            ->join('customers', 'customers.id', '=', 'orders.customer_id')
            ->where('status', Order::STATUS_PAID)
            ->where(function($query) use ($search) {
                $query->where('orders.api_code', 'LIKE', "%{$search}%")
                    ->orWhere('customers.name', 'LIKE', "%{$search}%");
            })
            ->where(function($query) {
                if (request('filter.marketplace'))
                    $query->where('orders.marketplace', request('filter.marketplace'));
            })
            ->select('orders.*')
            ->orderBy('priority', 'DESC')
            ->orderBy('estimated_delivery', 'ASC')
            ->orderBy('created_at', 'ASC')
            ->paginate(
                request('per_page', 10)
            );

        return listResponse($data);
    }

    /**
     * Set an order as priority
     *
     * @param  int $order_id
     * @return Order
     */
    public function prioritize($order_id)
    {
        try {
            $order = Order::findOrFail($order_id);

            if ($order->can_prioritize === false)
                throw new \Exception("Não é possível priorizar o pedido.");

            $order->priority = 1;
            $order->save();

            return showResponse($order);
        } catch (\Exception $exception) {
            return clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * Remove priority from order on invoiceable list
     *
     * @param  int $order_id
     * @return Order
     */
    public function unprioritize($order_id)
    {
        try {
            $order = Order::findOrFail($order_id);

            if ($order->can_prioritize === false)
                throw new \Exception("Não é possível despriorizar o pedido.");

            $order->priority = 0;
            $order->save();

            return showResponse($order);
        } catch (\Exception $exception) {
            return clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * Set an order as holded on invoiceable list
     *
     * @param  int $order_id
     * @return Order
     */
    public function hold($order_id)
    {
        try {
            $order = Order::findOrFail($order_id);

            if ($order->can_hold === false)
                throw new \Exception("Não é possível segurar o pedido.");

            $order->holded = 1;
            $order->save();

            return showResponse($order);
        } catch (\Exception $exception) {
            return clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * Set an order as holded on invoiceable list
     *
     * @param  int $order_id
     * @return Order
     */
    public function unhold($order_id)
    {
        try {
            $order = Order::findOrFail($order_id);

            if ($order->can_hold === false)
                throw new \Exception("Não é possível liberar o pedido.");

            $order->holded = 0;
            $order->save();

            return showResponse($order);
        } catch (\Exception $exception) {
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
            $data = Order::with([
                'customer',
                'customerAddress',
                'orderProductsGrouped',
                'orderProductsGrouped.product',
                'orderProductsGrouped.productSerial',
                'shipmentMethod',
                'paymentMethod',
                'marketplace',
                'shipments',
                'shipments.monitoredByUser',
                'shipments.devolution',
                'shipments.logistic',
                'shipments.issue',
                'invoices',
                'invoices.user',
                'invoices.invoice',
                'invoices.devolutions',
            ])->withCount(['comments', 'calls'])->findOrFail($id);

            return showResponse($data);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao obter recurso'));

            return clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * Set order as approved
     *
     * @param  int $order_id
     * @return void
     */
    public function approve($order_id)
    {
        try {
            $order = Order::find($order_id);

            if ($order->can_approve === false)
                throw new \Exception("Não é possível aprovar o pedido.");

            $order->status = Order::STATUS_PAID;
            $order->save();

            return showResponse($order);
        } catch (\Exception $exception) {
            return clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * Set order as invoiced
     *
     * @param  int $order_id
     * @return void
     */
    public function invoice($order_id)
    {
        try {
            $order = Order::find($order_id);
            $order->status = Order::STATUS_INVOICED;
            $order->save();

            return showResponse($order);
        } catch (\Exception $exception) {
            return clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * Set order as canceled
     *
     * @param  int $order_id
     * @return void
     */
    public function cancel($order_id)
    {
        try {
            $order = Order::find($order_id);

            if ($order->can_cancel === false)
                throw new \Exception("Não é possível aprovar o pedido.");

            $order->status = Order::STATUS_CANCELED;
            $order->save();

            return showResponse($order);
        } catch (\Exception $exception) {
            return clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * Return order information for shopsystem integration
     *
     * @param  string $order
     * @return array
     */
    public function shopsystem($api_code)
    {
        try {
            if ($order = Order::where('api_code', $api_code)->first()) {
                $shipment      = $order->shipments()->orderBy('created_at', 'DESC')->first();
                $tracking_code = ($shipment) ? $shipment->tracking_code : null;

                return showResponse([
                    'taxvat'      => $order->customer->taxvat,
                    'nome'        => mb_strtolower(removeAcentos($order->customer->name)),
                    'email'       => removeAcentos($order->customer->email),
                    'cep'         => removeAcentos($order->customerAddress->zipcode),
                    'telefone'    => numbers($order->customer->phone),
                    'rua'         => removeAcentos($order->customerAddress->street),
                    'numero'      => numbers($order->customerAddress->number),
                    'bairro'      => removeAcentos($order->customerAddress->district),
                    'complemento' => removeAcentos($order->customerAddress->complement),
                    'marketplace' => mb_strtolower($order->marketplace),
                    'order'       => $api_code,
                    'frete'       => $order->shipment_cost,
                    'rastreio'    => $tracking_code
                ]);
            }
        } catch (\Exception $e) {
            \Log::warning(logMessage($e, 'Não foi possível obter os dados do order para o shopsystem!'));
        }

        return notFoundResponse();
    }

    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function store(Request $request)
    {
        try {
            \DB::transaction(function() use ($request, &$order) {
                $order = Order::create($request->all());

                $products = collect($request->input('products'));
                $orderProducts = $this->processOrderProducts($products);

                $order->orderProducts()->saveMany($orderProducts);
            });

            return createdResponse($order);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao salvar recurso'));

            return clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function update(Request $request, $id)
    {
        try {
            $order = Order::findOrFail($id);
            \DB::transaction(function() use ($request, &$order) {
                $order->fill($request->all());
                $order->save();

                $order->orderProducts()->delete();

                $products = collect($request->input('products'));
                $orderProducts = $this->processOrderProducts($products);

                $order->orderProducts()->saveMany($orderProducts);
            });

            return createdResponse($order);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao salvar recurso'));

            return clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * Verify if OrderProduct can be created
     *
     * @param Arrayable $products
     */
    private function processOrderProducts($products)
    {
        $productSkus = Product::with(['reservedStockCount', 'availableStockCount'])
            ->whereIn('sku', $products->pluck('product_sku'))
            ->get();

        foreach ($products as $product) {
            $compareProduct = $productSkus->where('sku', $product['product_sku'])->first();

            if (!$compareProduct)
                throw new \Exception("Produto com SKU {$product['product_sku']} não cadastrado no sistema.");

            if ($compareProduct->available_stock === 0)
                throw new \Exception("Produto com SKU {$product['product_sku']} não possui unidades em estoque.");

            if ($product['quantity'] > $compareProduct->available_stock)
                throw new \Exception("Produto com SKU {$product['product_sku']} possui apenas {$compareProduct->available_stock} unidade(s) em estoque.");

            for ($i = 0; $i < $product['quantity']; $i++) {
                $orderProducts[] = new OrderProduct($product);
            }
        }

        return $orderProducts;
    }

    /**
     * Cancel old orders based on deadline configured by company
     *
     * @return void
     */
    // public static function cancelOldOrders()
    // {
    //     $orders = Order::where('status', '=', 0)->whereNotNull('api_code')->get();
    //
    //     foreach ($orders as $order) {
    //         try {
    //             $createdDate = Carbon::createFromFormat('Y-m-d H:i:s', $order->created_at)->format('d/m/Y');
    //             $utilDays    = diasUteisPeriodo($createdDate, date('d/m/Y'), true);
    //
    //             if (strtolower($order->marketplace) == 'site') {
    //                 if (($order->payment_method == 'boleto' && $utilDays > config('magento.old_order.boleto'))
    //                     || ($order->payment_method == 'credito' && $utilDays > config('magento.old_order.credito'))) {
    //                     $order->status = 5;
    //                     $order->save();
    //                 }
    //             }
    //         } catch (\Exception $e) {
    //             Log::error(logMessage($e, 'Não foi possível cancelar o order na Integração'));
    //         }
    //     }
    // }
}
