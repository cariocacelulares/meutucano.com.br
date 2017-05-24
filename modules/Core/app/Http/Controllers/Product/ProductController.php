<?php namespace Core\Http\Controllers\Product;

use Carbon\Carbon;
use Core\Models\Order;
use Core\Models\Product;
use Core\Models\OrderProduct;
use App\Http\Controllers\Controller;
use Core\Transformers\ProductTransformer;
use Core\Http\Requests\Product\ProductRequest as Request;

class ProductController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:product_list', ['only' => ['index', 'find']]);
        $this->middleware('permission:product_show', ['only' => ['show']]);
        $this->middleware('permission:product_create', ['only' => ['store']]);
        $this->middleware('permission:product_update', ['only' => ['update']]);
        $this->middleware('permission:product_delete', ['only' => ['destroy']]);

        $this->middleware('convertJson', ['only' => ['index', 'header']]);
    }

    /**
     * Render list based on filters
     *
     * @return Builder
     */
    private function list()
    {
        return Product::with(['reservedStockCount', 'availableStockCount'])
            ->where(function($query) {
                if (request('filter.line_id'))
                    $query->where('line_id', request('filter.line_id'));
            });
    }

    /**
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function index()
    {
        $search = request('search');

        $data = $this->list()
            ->where(function($query) use ($search) {
                $query->where('sku', 'LIKE', "%{$search}%")
                    ->orWhere('ean', 'LIKE', "%{$search}%")
                    ->orWhere('title', 'LIKE', "%{$search}%");
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

        $in_stock = $data->where('available_stock', '>', 0);
        $header['in_stock'] = [
            'quantity' => $in_stock->sum('available_stock'),
            'total'    => $in_stock->sum(function($product) {
                return $product->price * $product->available_stock;
            })
        ];

        return showResponse($header);
    }

    /**
     * @param  string $term
     * @return Object
     */
    public function fetch()
    {
        $search = request('search');

        $data = Product::where('active', true)
            ->where(function($query) use ($search) {
                $query->where('title', 'LIKE', "%{$search}%")
                    ->orWhere('sku', 'LIKE', "%{$search}%");
            })
            ->get();

        return listResponse($data);
    }

    /**
     * Return last depot entry from product
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function lastDepotEntry($id)
    {
        try {
            $data = Product::with([
                'lastEntryProduct.depotEntry',
                'lastEntryProduct.depotEntry.productsSummary',
                'lastEntryProduct.depotEntry.supplier',
            ])->findOrFail($id);

            return showResponse($data->lastEntryProduct ? $data->lastEntryProduct->depotEntry : []);
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
            $data = Product::with([
                'line',
                'brand',
                'availableStockCount',
                'issuesCount',
                'defectsCount'
            ])->withCount('depotProducts')->findOrFail($id);

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
            $data = Product::create($request->all());

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
            $data = Product::findOrFail($id);
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
    public function activate($id)
    {
        try {
            $data = Product::findOrFail($id);
            $data->active = true;
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
    public function deactivate($id)
    {
        try {
            $data = Product::findOrFail($id);
            $data->active = false;
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
            $data = Product::findOrFail($id);
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
     * Return graph of orders per month
     *
     * @param  int $sku
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function graphOrderPeriod($sku)
    {
        try {
            $data = Product::with(['orderProducts', 'orderProducts.order' => function($query) {
                $query->where("created_at", ">", Carbon::now()->subMonths(5));
            }])->findOrFail($sku);

            $orders = $data->orderProducts->pluck('order')->filter(function($order) {
                return !is_null($order);
            })->groupBy(function ($order) {
                return $order->created_at->month;
            });

            $graph = [];
            foreach (lastMonthsAsArray() as $month) {
                $graph[] = [
                    'month'    => config('core.meses')[$month],
                    'quantity' => sizeof($orders->get($month))
                ];
            }

            return showResponse($graph);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao exibir recurso'));

            return clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * Return graph of orders per marketplace from current month
     *
     * @param  int $sku
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function graphOrderMarketplace($sku)
    {
        try {
            $data = Product::with(['orderProducts', 'orderProducts.order.marketplace' , 'orderProducts.order' => function($query) {
                $query->where("created_at", '>', Carbon::now()->startOfMonth())
                    ->where("created_at", '<', Carbon::now()->endOfMonth());
            }])->findOrFail($sku);

            $orders = $data->orderProducts->pluck('order')->filter(function($order) {
                return !is_null($order);
            })->groupBy(function ($order) {
                return $order->marketplace->title;
            })->transform(function($order) {
                return sizeof($order);
            });

            $graph = [];
            $sumValues = $orders->sum();
            foreach ($orders as $marketplace => $order) {
                $graph[] = [
                    'marketplace' => $marketplace,
                    'percent'     => round(($order / $sumValues) * 100)
                ];
            }

            return showResponse($graph);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao exibir recurso'));

            return clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * Return graph of costs from product per month
     *
     * @param  int $sku
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function graphCostPeriod($sku)
    {
        try {
            $data = Product::with(['depotEntryProducts' => function($query) {
                $query->where("created_at", ">", Carbon::now()->subMonths(5));
            }])->findOrFail($sku);

            $depotEntryProducts = $data->depotEntryProducts->groupBy(function ($product) {
                return $product->created_at->month;
            })->transform(function($products) {
                $sumValue = $products->sum(function ($product) {
                    return $product->quantity * $product->unitary_value;
                });

                return $sumValue / $products->sum('quantity');
            });

            $graph = [];
            $lastMonth = null;
            foreach (lastMonthsAsArray() as $key => $month) {
                $graph[$key]['month'] = config('core.meses')[$month];

                if (!$depotEntryProducts->get($month) && $lastMonth && $depotEntryProducts->get($lastMonth))
                    $month = $lastMonth;

                $graph[$key]['quantity'] = $depotEntryProducts->get($month) ?: 0;

                $lastMonth = $month;
            }

            return showResponse($graph);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao exibir recurso'));

            return clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }
}
