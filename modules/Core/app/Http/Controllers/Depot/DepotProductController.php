<?php namespace Core\Http\Controllers\Depot;

use Core\Models\Depot;
use Core\Models\Pedido;
use Core\Models\Product;
use Core\Models\DepotProduct;
use Core\Models\ProductSerial;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Input;
use Core\Models\DepotWithdrawProduct;

class DepotProductController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:product_depot_list', ['only' => [
            'index',
            'listByProduct',
            'listByDepot'
        ]]);
        $this->middleware('permission:product_depot_show', ['only' => ['show']]);
        $this->middleware('permission:product_depot_create', ['only' => ['store']]);
        $this->middleware('permission:product_depot_update', ['only' => ['update']]);
        $this->middleware('permission:product_depot_delete', ['only' => ['destroy']]);
    }

    /**
     * Returns a list of DepotProduct filtered by sku
     *
     * @param  int $sku
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function listByProduct($sku)
    {
        try {
            $depotProducts = DepotProduct::with(['depot'])
                ->where('product_sku', '=', $sku)
                ->orderBy('quantity', 'DESC')
                ->get();

            return listResponse($depotProducts);
        } catch (\Exception $exception) {
            return clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * Returns a list of DepotProduct filtered by slug
     *
     * @param  int $slug
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function listByDepot($slug)
    {
        try {
            $depotProducts = DepotProduct::with(['product'])
                ->where('depot_slug', '=', $slug)
                ->orderBy('quantity', 'DESC');

            return tableListResponse($depotProducts);
        } catch (\Exception $exception) {
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
            $data = DepotProduct::create($request->all());

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
            $data = DepotProduct::findOrFail($id);
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
     * Transfer $imeis of products $from $to
     *
     * @param  DepotProduct $from
     * @param  DepotProduct $to
     * @param  array        $imeis
     * @return boolean|Response
     */
    private function transferImeis(DepotProduct $from, DepotProduct $to, array $imeis)
    {
        $this->middleware('permission:depot_transfer');

        if (!$imeis || empty($imeis)) {
            return $this->validationFailResponse([
                'Nenhum serial foi informado ou são inválidos.'
            ]);
        }

        DB::beginTransaction();
        Log::debug('Transaction - begin');

        try {
            foreach ($imeis as $imei) {
                $error = false;

                $productImei = ProductSerial
                    ::where('imei', '=', $imei)
                    ->first();

                if (!$productImei) {
                    $error = 'Os estoques de destino e origem não possuem a mesma opção de controle serial!';
                }

                if ('product_depot_id' != $from->id) {
                    $error = 'Os estoques de destino e origem não possuem a mesma opção de controle serial!';
                }

                $productImei->product_depot_id = $to->id;
                $from->quantity                = $from->quantity - 1;
                $to->quantity                  = $to->quantity + 1;

                if (!$productImei->save() || !$from->save() || !$to->save()) {
                    throw new \Exception('Erro ao salvar recursos', 1);
                }
            }
        } catch (\Exception $exception) {
            DB::rollBack();
            Log::debug('Transaction - rollback');
            Log::warning(logMessage($exception, 'Erro ao tentar realizar uma transferencia de estoque'), [
                'from'     => $from->id,
                'to'       => $to->id,
                'from_qty' => $from->quantity,
                'to_qty'   => $to->quantity,
                'imeis'    => $imeis,
            ]);

            return false;
        }

        DB::commit();
        Log::debug('Transaction - commit');
        Log::info('Transferencia de estoque realizada com sucesso', [
            'from'     => $from->id,
            'to'       => $to->id,
            'from_qty' => $from->quantity,
            'to_qty'   => $to->quantity,
            'imeis'    => $imeis,
        ]);

        return true;
    }

    /**
     * Verify if transfer is enabled and do it
     *
     * @return Response
     */
    public function transfer()
    {
        $this->middleware('permission:depot_transfer');

        $from  = Input::get('from');
        $to    = Input::get('to');
        $qty   = Input::get('qty');

        $imeis = [];
        foreach ((Input::get('imeis') ?: []) as $imei) {
            if (trim($imei)) {
                $imeis[] = trim($imei);
            }
        }

        $from = DepotProduct::findOrFail($from);
        $to   = DepotProduct::findOrFail($to);

        if ($from->serial_enabled !== $to->serial_enabled) {
            return $this->validationFailResponse([
                'Os estoques de destino e origem não possuem a mesma opção de controle serial!'
            ]);
        }

        if ($from->serial_enabled) {
            $return = $this->transferImeis($from, $to, $imeis);
        } else {
            $return = $this->transferQty($from, $to, $qty);
        }

        return $this->showResponse($return);
    }

    /**
     * Verifica se um $imei pode ser transferido de um product depot $id
     *
     * @param  int $id
     * @param  string $imei
     * @return Response
     */
    public function verifyTransfer($id, $imei)
    {
        try {
            $depotProduct = DepotProduct::findOrFail($id);

            $productImei = ProductSerial::where('imei', '=', $imei)->first();

            if (!$productImei) {
                return $this->listResponse([
                    'icon'    => 'ban',
                    'message' => 'Serial não registrado!',
                    'ok'      => false,
                ]);
            }

            if ($productImei->product_depot_id != $depotProduct->id) {
                return $this->listResponse([
                    'icon'    => 'exclamation',
                    'message' => 'Serial não pertence ao estoque selecionado!',
                    'ok'      => false,
                ]);
            }

            $removalProduct = DepotWithdrawProduct::where('product_imei_id', '=', $productImei->id)
                ->whereNotIn('status', [2, 3])
                ->first();

            if ($removalProduct) {
                return $this->listResponse([
                    'icon'    => 'shopping-cart',
                    'message' => "Serial em aberto na retirada #{$removalProduct->depot_removal_id}",
                    'ok'      => false,
                ]);
            }

            $order = Pedido::join('pedido_produtos', 'pedido_produtos.pedido_id', 'pedidos.id')
                ->where('pedido_produtos.product_imei_id', '=', $productImei->id)
                ->whereIn('pedidos.status', [2, 3])
                ->orderBy('pedidos.created_at', 'DESC')
                ->first();

            if ($order) {
                return $this->listResponse([
                    'icon'    => 'cart-arrow-down',
                    'message' => 'Serial já faturado!',
                    'ok'      => false,
                ]);
            }

            return $this->listResponse([
                'icon'    => 'check',
                'message' => 'Serial disponível!',
                'ok'      => true,
            ]);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Não foi possível verificar o imei!'));

            return $this->listResponse([
                'icon'    => 'times',
                'message' => 'Não foi possível verificar o imei!',
                'ok'      => false,
            ]);
        }
    }
}
