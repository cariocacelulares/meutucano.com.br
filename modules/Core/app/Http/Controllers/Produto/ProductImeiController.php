<?php namespace Core\Http\Controllers\Produto;

use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use App\Models\Usuario\Usuario;
use Core\Models\Pedido;
use Core\Models\Produto;
use Core\Models\Produto\ProductStock;
use Core\Models\Produto\ProductImei;
use Core\Transformers\ProductImeiTransformer;

/**
 * Class ProductImeiController
 * @package Core\Http\Controllers\Produto
 */
class ProductImeiController extends Controller
{
    use RestControllerTrait;

    const MODEL = ProductImei::class;

    /**
     * Returns a list of ProductImei available filtered by sku
     *
     * @param  int $sku
     * @return Response
     */
    public function listBySku($sku)
    {
        try {
            $product = Produto::findOrFail($sku);

            $productImeis = (self::MODEL)
                ::with(['productStock', 'productStock.stock'])
                ->join('product_stocks', 'product_imeis.product_stock_id', 'product_stocks.id')
                ->leftJoin('pedido_produtos', 'product_imeis.id', 'pedido_produtos.product_imei_id')
                ->leftJoin('pedidos', 'pedido_produtos.pedido_id', 'pedidos.id')
                ->where('product_stocks.product_sku', '=', $sku)
                ->where(function ($query) {
                    $query->whereNotIn('pedidos.status', [0, 1, 2, 3]);
                    $query->orWhereNull('pedidos.status');
                })
                ->where(
                    \DB::raw('(
                        SELECT COUNT(*)
                        FROM pedido_produtos p1
                            JOIN pedidos o1 ON p1.pedido_id = o1.id
                        WHERE p1.product_imei_id = product_imeis.id
                            AND (o1.status IN (0,1,2,3) OR o1.status IS NULL
                        )
                    )'),
                    '=',
                    0
                )
                ->orderBy('product_imeis.created_at', 'DESC')
                ->select(['product_imeis.*']);

            $productImeis = $this->handleRequest($productImeis);

            return $this->listResponse(ProductImeiTransformer::listBySku($productImeis));
        } catch (\Exception $exception) {
            return $this->clientErrorResponse([
                'exception' => $exception->getMessage()
            ]);
        }
    }

    /**
     * Atualiza um recurso
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function update($id)
    {
        try {
            $data = (self::MODEL)::findOrFail($id);
            $data->fill(Input::all());
            $data->save();

            return $this->showResponse($data);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao atualizar recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse([
                'exception' => $exception->getMessage()
            ]);
        }
    }

    /**
     * Parse imeis and get each product info
     *
     * @return Response
     */
    public function parseImeis()
    {
        $imeis = Input::get('imeis');

        try {
            $products   = [];
            $registered = [];

            foreach ($imeis as $item) {
                $imei = trim($item['imei']);

                if ($item['ok'] !== true || array_search($imei, $registered) !== false) {
                    continue;
                }

                if ($imei) {
                    $imei = ProductImei
                        ::with([
                            'productStock',
                            'productStock.stock',
                            'productStock.product',
                        ])
                        ->where('imei', '=', $imei)
                        ->first();
                }

                if ($imei) {
                    $products[] = [
                        'imei'             => $imei->imei,
                        'product_imei_id'  => $imei->id,
                        'product_stock_id' => $imei->productStock->id,
                        'stock'            => $imei->productStock->stock->title,
                        'sku'              => $imei->productStock->product->sku,
                        'title'            => $imei->productStock->product->titulo,
                    ];

                    $registered[] = $imei->imei;
                }
            }

            return $this->listResponse([
                'products' => $products
            ]);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao organizar imeis na retirada de estoque!'));
        }

        return $this->listResponse([
            'products' => []
        ]);
    }

    public function history($imei)
    {
        $productImei = (self::MODEL)::where('imei', '=', $imei)->withTrashed()->first();

        if ($productImei) {
            try {
                $actions      = [];
                $deleteAction = null;

                $issue           = $productImei->issue;
                $removalProducts = $productImei->removalProducts;
                $pedidoProdutos  = $productImei->pedidoProdutos;

                $imeiCreated = null;
                $firstStock  = false;
                $revisions   = $productImei->revisionHistory;
                foreach ($revisions as $revision) {
                    if ($revision->key == 'created_at') {
                        $imeiCreated = [
                            'key'   => strtotime($revision->new_value),
                            'value' => [
                                'model' => 'ProductImei',
                                'desc'  => 'Serial registrado',
                                'date'  => dateConvert($revision->new_value),
                                'user'  => $revision->user_id ? Usuario::find($revision->user_id)->name : null,
                            ],
                        ];
                    } else if ($revision->key == 'deleted_at') {
                        $actions[strtotime($revision->new_value)][] = [
                            'model' => 'ProductImei',
                            'desc'  => 'Serial excluido',
                            'date'  => dateConvert($revision->new_value),
                            'user'  => $revision->user_id ? Usuario::find($revision->user_id)->name : null,
                        ];
                    } else if ($revision->key == 'product_stock_id') {
                        $oldStock = ProductStock::find($revision->old_value)->stock->title;
                        $newStock = ProductStock::find($revision->new_value)->stock->title;

                        if (!$firstStock) {
                            $firstStock = $oldStock;
                        }

                        $actions[strtotime($revision->created_at)][] = [
                            'model' => 'ProductImei',
                            'desc'  => "Transferência do estoque '{$oldStock}' para o estoque '{$newStock}'",
                            'date'  => dateConvert($revision->created_at),
                            'user'  => $revision->user_id ? Usuario::find($revision->user_id)->name : null,
                        ];
                    }
                }

                if ($imeiCreated) {
                    if ($firstStock) {
                        $imeiCreated['value']['desc'] .= " no estoque '{$firstStock}'";
                    }

                    $actions[$imeiCreated['key']][] = $imeiCreated['value'];
                }

                if ($issue) {
                    $actions[strtotime($issue->created_at)][] = [
                        'model' => 'Issue',
                        'desc'  => "Baixa de estoque<br/>Motivo: {$issue->reason} - {$issue->description}",
                        'date'  => dateConvert($issue->created_at),
                        'user'  => $issue->user_id ? Usuario::find($issue->user_id)->name : null,
                    ];
                }

                foreach ($removalProducts as $removalProduct) {
                    $revisions = $removalProduct->revisionHistory;

                    foreach ($revisions as $revision) {
                        if ($revision->key == 'created_at') {
                            $actions[strtotime($revision->new_value)][] = [
                                'model' => 'Removal',
                                'desc'  => "Registrado na retirada de estoque #{$removalProduct->stock_removal_id}",
                                'date'  => dateConvert($revision->new_value),
                                'user'  => $revision->user_id ? Usuario::find($revision->user_id)->name : null,
                            ];
                        } elseif ($revision->key == 'status') {
                            $oldStatus = \Config('core.stock_removal_status')[$revision->old_value];
                            $newStatus = \Config('core.stock_removal_status')[$revision->new_value];

                            $actions[strtotime($revision->created_at)][] = [
                                'model' => 'Removal',
                                'desc'  => "Status na retirada de estoque #{$removalProduct->stock_removal_id} alterado de {$oldStatus} para {$newStatus}",
                                'date'  => dateConvert($revision->created_at),
                                'user'  => $revision->user_id ? Usuario::find($revision->user_id)->name : null,
                            ];
                        }
                    }
                }

                foreach ($pedidoProdutos as $pedidoProduto) {
                    $orderCreated = null;
                    $revisions    = $pedidoProduto->revisionHistory;
                    foreach ($revisions as $revision) {
                        if ($revision->key == 'product_imei_id') {
                            $orderCreated = [
                                'key'   => strtotime($revision->created_at),
                                'value' => [
                                    'model' => 'Pedido',
                                    'desc'  => "Anexado ao pedido {$pedidoProduto->pedido_id}",
                                    'date'  => dateConvert($revision->created_at),
                                    'user'  => $revision->user_id ? Usuario::find($revision->user_id)->name : null,
                                ]
                            ];
                        }
                    }

                    $pedido      = Pedido::find($pedidoProduto->pedido_id);
                    $revisions   = $pedido->revisionHistory;
                    $firstStatus = false;
                    foreach ($revisions as $revision) {
                        if ($revision->key == 'status') {
                            $oldStatus = \Config('core.pedido_status')[$revision->old_value];
                            $newStatus = \Config('core.pedido_status')[$revision->new_value];

                            if (!$firstStatus) {
                                $firstStatus = $oldStatus;
                            }

                            $actions[strtotime($revision->created_at)][] = [
                                'model' => 'Pedido',
                                'desc'  => "Status do pedido {$revision->revisionable_id} alterado de {$oldStatus} para {$newStatus}",
                                'date'  => dateConvert($revision->created_at),
                                'user'  => $revision->user_id ? Usuario::find($revision->user_id)->name : null,
                            ];
                        }
                    }

                    if ($orderCreated) {
                        if ($firstStatus) {
                            $orderCreated['value']['desc'] .= " com o status {$firstStatus}";
                        }

                        $actions[$orderCreated['key']][] = $orderCreated['value'];
                    }
                }

                ksort($actions);

                $history = [];
                foreach ($actions as $list) {
                    foreach ($list as $action) {
                        $history[] = $action;
                    }
                }

                return $this->showResponse($history);
            } catch (\Exception $exception) {
                \Log::error(logMessage($exception, 'Erro ao consultar histórico de imei'));

                return $this->clientErrorResponse('Erro ao consultar histórico de imei');
            }
        } else {
            return $this->showResponse([]);
        }
    }
}
