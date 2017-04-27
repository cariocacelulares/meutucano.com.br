<?php namespace Core\Http\Controllers\Pedido;

use Carbon\Carbon;
use Core\Models\Pedido;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Core\Models\Pedido\PedidoProduto;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Config;
use Core\Transformers\OrderTransformer;
use Core\Http\Requests\PedidoRequest as Request;
use App\Http\Controllers\Rest\RestControllerTrait;

/**
 * Class PedidoController
 * @package Core\Http\Controllers\Pedido
 */
class PedidoController extends Controller
{
    use RestControllerTrait;

    const MODEL = Pedido::class;

    public function __construct()
    {
        $this->middleware('permission:order_list', ['only' => ['index']]);
        $this->middleware('permission:order_show', ['only' => ['show']]);
        $this->middleware('permission:order_create', ['only' => ['store']]);
        $this->middleware('permission:order_update', ['only' => ['update']]);
        $this->middleware('permission:order_delete', ['only' => ['destroy']]);
    }

    /**
     * Lista pedidos para a tabela
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function tableList()
    {
        $this->middleware('permission:order_list');

        $list = Pedido::with(['cliente', 'endereco'])
            ->join('clientes', 'clientes.id', '=', 'pedidos.cliente_id')
            ->leftJoin('pedido_notas', 'pedido_notas.pedido_id', '=', 'pedidos.id')
            ->orderBy('pedidos.created_at', 'DESC');

        $list = $this->handleRequest($list);

        return $this->listResponse(OrderTransformer::tableList($list));
    }

    /**
     * Lista pedidos prontos para serem faturados
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function faturamento()
    {
        $this->middleware('permission:order_list');

        $list = Pedido::with([
                'cliente',
                'endereco',
                'notas',
                'rastreios',
                'produtos',
                'produtos.produto',
                'comentarios'
            ])
            ->join('clientes', 'clientes.id', '=', 'pedidos.cliente_id')
            ->join('cliente_enderecos', 'cliente_enderecos.id', '=', 'pedidos.cliente_endereco_id')
            ->leftJoin('pedido_rastreios', 'pedido_rastreios.pedido_id', '=', 'pedidos.id')
            ->leftJoin('pedido_produtos', 'pedido_produtos.pedido_id', '=', 'pedidos.id')
            ->leftJoin('pedido_notas', 'pedido_notas.pedido_id', '=', 'pedidos.id')
            ->where('pedidos.status', '=', 1)
            ->groupBy('pedidos.id')
            ->orderBy('priorizado', 'DESC')
            ->orderBy('estimated_delivery', 'ASC')
            ->orderBy('created_at', 'ASC');

        $list = $this->handleRequest($list);

        return $this->listResponse(OrderTransformer::faturamento($list));
    }

    /**
     * Adiciona ou remove prioridade de um pedido
     * @param  int $pedido_id
     * @return Pedido
     */
    public function prioridade($pedido_id)
    {
        $this->middleware('permission:order_prioritize');

        try {
            $prioridade = Input::get('priorizado');
            $prioridade = (int)$prioridade ? 1 : null;

            $pedido = Pedido::find($pedido_id);
            $pedido->priorizado = $prioridade;
            $pedido->save();

            return $this->showResponse($pedido);
        } catch (\Exception $exception) {
            return $this->clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * Segura ou libera um pedido
     * @param  int $pedido_id
     * @return Pedido
     */
    public function segurar($pedido_id)
    {
        $this->middleware('permission:order_hold');

        try {
            $segurar = Input::get('segurar');
            $segurar = (int)$segurar ? 1 : 0;

            $pedido = Pedido::find($pedido_id);
            $pedido->segurado = $segurar;
            $pedido->save();

            return $this->showResponse($pedido);
        } catch (\Exception $exception) {
            return $this->clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * Altera status do pedido e adiciona o protocolo
     *
     * @param  Pedido $pedido_id
     * @param  int $protocolo
     * @return Pedido
     */
    public function alterarStatus($pedido_id)
    {
        $this->middleware('permission:order_update');

        try {
            $status    = Input::get('status');
            $protocolo = Input::get('protocolo');

            if (!$status && $status !== 0) {
                throw new \Exception('Campo de status obrigatório', 1);
            }

            $pedido = Pedido::find($pedido_id);

            if ($status === 5 && !$protocolo && in_array($pedido->marketplace, \Config::get('core.required_protocolo'))) {
                throw new \Exception('Protocolo obrigatório para cancelar pedidos nesse marketplace.', 422);
            }

            if ($protocolo) {
                $pedido->protocolo = $protocolo;
            }

            if ($status == 2 && !$pedido->rastreios) {
                $status = 3;
            }

            $pedido->status = $status;
            $pedido->save();

            return $this->showResponse($pedido);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao alterar status do pedido'));

            return $this->clientErrorResponse([
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
        $this->middleware('permission:order_show');

        try {
            $data = Pedido::with([
                'cliente',
                'endereco',
                'notas' => function ($query) {
                    $query->withTrashed();
                },
                'rastreios' => function ($query) {
                    $query->withTrashed();
                },
                'produtos',
                'produtos.produto',
                'produtos.productImei',
                'comentarios',
                'rastreios.devolucao',
                'rastreios.pi',
                'rastreios.logistica'
            ])->find($id);

            if ($data) {
                return $this->showResponse(OrderTransformer::show($data));
            }
        } catch (\Exception $exception) {
            if ($exception->getPrevious()) {
                throw $exception->getPrevious();
            } else {
                throw $exception;
            }
        }

        return $this->notFoundResponse();
    }

    /**
     * Cancela pedidos com mais de x dias úteis de pagamento pendente
     *
     * @return void
     */
    public static function cancelOldOrders()
    {
        $pedidos = Pedido::where('status', '=', 0)->whereNotNull('codigo_api')->get();

        foreach ($pedidos as $pedido) {
            try {
                $dataPedido = Carbon::createFromFormat('Y-m-d H:i:s', $pedido->created_at)->format('d/m/Y');
                $diasUteis = diasUteisPeriodo($dataPedido, date('d/m/Y'), true);

                if (strtolower($pedido->marketplace) == 'site') {
                    if (($pedido->pagamento_metodo == 'boleto' && $diasUteis > Config::get('magento.old_order.boleto'))
                        || ($pedido->pagamento_metodo == 'credito' && $diasUteis > Config::get('magento.old_order.credito'))) {
                        $pedido->status = 5;
                        $pedido->save();
                    }
                }
            } catch (\Exception $e) {
                Log::error(logMessage($e, 'Não foi possível cancelar o pedido na Integração'));
            }
        }
    }

    /**
     * Envia informações de entrega e nota
     *
     * @param  int $pedido_id
     * @return void
     */
    public function faturar($pedido_id)
    {
        Log::debug("Tentando faturar o pedido {$pedido_id}");

        if ($pedido = Pedido::find($pedido_id)) {
            $pedido->status = 2;
            $pedido->save();
        }
    }

    /**
     * Retorna as informações do pedido para importar no Shopsystem
     *
     * @param  string $pedido
     * @return array
     */
    public function shopsystem($codigo_pedido)
    {
        try {
            if ($pedido = Pedido::where('codigo_marketplace', '=', $codigo_pedido)->first()) {
                $rastreio = $pedido->rastreios()->orderBy('created_at', 'DESC')->first();
                $codigo   = ($rastreio) ? $rastreio->rastreio : null;

                return $this->showResponse([
                    'taxvat'      => $pedido->cliente->taxvat,
                    'nome'        => mb_strtolower(removeAcentos($pedido->cliente->nome)),
                    'email'       => removeAcentos($pedido->cliente->email),
                    'cep'         => removeAcentos($pedido->endereco->cep),
                    'telefone'    => numbers($pedido->cliente->fone),
                    'rua'         => removeAcentos($pedido->endereco->rua),
                    'numero'      => numbers($pedido->endereco->numero),
                    'bairro'      => removeAcentos($pedido->endereco->bairro),
                    'complemento' => removeAcentos($pedido->endereco->complemento),
                    'marketplace' => mb_strtolower($pedido->marketplace),
                    'pedido'      => $codigo_pedido,
                    'frete'       => $pedido->frete_valor,
                    'rastreio'    => $codigo
                ]);
            }
        } catch (\Exception $e) {
            \Log::warning(logMessage($e, 'Não foi possível obter os dados do pedido para o shopsystem!'));
        }

        return $this->notFoundResponse();
    }

    /**
     * Create a new resource
     *
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function store(Request $request)
    {
        $this->middleware('permission:order_create');

        try {
            DB::beginTransaction();
            Log::debug('Transaction - begin');

            $order = Pedido::create(Input::except([
                'cliente',
                'products',
            ]));

            $orderProducts = Input::get('products');
            if ($orderProducts) {
                $products   = [];
                $quantities = [];
                foreach ($orderProducts as $orderProduct) {
                    for ($i=0; $i < $orderProduct['qtd']; $i++) {
                        $products[] = $orderProduct;
                        $quantities[$orderProduct['sku']] = isset($quantities[$orderProduct['sku']]) ? $quantities[$orderProduct['sku']] +1 : 1;
                    }
                }

                foreach ($quantities as $sku => $qtd) {
                    $stock = \Stock::get($sku)[0];

                    if ($stock < $qtd) {
                        return $this->validationFailResponse([
                            "Você está solicitando {$qtd} quantidades do produto {$sku}, mas existem apenas {$stock} em estoque."
                        ]);
                    }
                }

                foreach ($products as $orderProduct) {
                    PedidoProduto::create([
                        'pedido_id'        => $order->id,
                        'produto_sku'      => $orderProduct['sku'],
                        'valor'            => $orderProduct['valor'],
                    ]);
                }
            }

            DB::commit();
            Log::debug('Transaction - commit');

            return $this->createdResponse($order);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao salvar recurso'), ['model' => self::MODEL]);

            DB::rollBack();
            Log::debug('Transaction - rollback');

            return $this->clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }
}
