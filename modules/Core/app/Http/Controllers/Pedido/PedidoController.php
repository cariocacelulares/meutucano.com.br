<?php namespace Core\Http\Controllers\Pedido;

use Carbon\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use Core\Models\Pedido;
use Core\Models\Pedido\PedidoProduto;
use Core\Transformers\OrderTransformer;
use Core\Http\Requests\PedidoRequest as Request;

/**
 * Class PedidoController
 * @package Core\Http\Controllers\Pedido
 */
class PedidoController extends Controller
{
    use RestControllerTrait;

    const MODEL = Pedido::class;

    /**
     * Lista pedidos para a tabela
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function tableList()
    {
        $list = (self::MODEL)::with(['cliente', 'endereco'])
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
        $list = (self::MODEL)::with([
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
        try {
            $prioridade = Input::get('priorizado');
            $prioridade = (int)$prioridade ? 1 : null;

            $pedido = (self::MODEL)::find($pedido_id);
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
        try {
            $segurar = Input::get('segurar');
            $segurar = (int)$segurar ? 1 : 0;

            $pedido = (self::MODEL)::find($pedido_id);
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
        try {
            $status    = Input::get('status');
            $protocolo = Input::get('protocolo');

            if (!$status && $status !== 0) {
                throw new \Exception('Campo de status obrigatório', 1);
            }

            $pedido = (self::MODEL)::find($pedido_id);

            if ($status === 5 && !$protocolo && in_array($pedido->marketplace, \Config::get('core.required_protocolo'))) {
                throw new \Exception('Protocolo obrigatório para cancelar pedidos nesse marketplace.', 422);
            }

            if ($protocolo) {
                $pedido->protocolo = $protocolo;
            }

            $imagem = Input::file('imagem');
            if ($imagem) {
                $name = substr(str_slug($protocolo . '-' . $imagem->getClientOriginalName()), 0, 200) . '.' . $imagem->extension();
                $imagem->move(storage_path('app/public/cancelamento'), $name);
                $pedido->imagem_cancelamento = $name;
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
        try {
            $data = (self::MODEL)::with([
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
            ])
                ->find($id);

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
     * Envia informações de entrega e nota para o Magento / Skyhub
     *
     * @param  int $pedido_id
     * @return void
     */
    public function faturar($pedido_id)
    {
        Log::debug("Tentando faturar o pedido {$pedido_id}");

        if ($pedido = Pedido::find($pedido_id)) {
            $pedido->status = 2;

            if ($pedido->save()) {
                \Event::fire(new \Gamification\Events\TarefaRealizada('fature-um-pedido'));
            }
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
            if ($pedido = (self::MODEL)::where('codigo_marketplace', '=', $codigo_pedido)->first()) {
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
     * Retorna o total de pedidos por marketplace por status
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function totalOrdersByStatus()
    {
        $ano       = date('Y');
        $mes       = date('m');
        $dia       = date('d');
        $inicioMes = "{$ano}-{$mes}-01 00:00:00";

        $pedidos = Pedido
            ::selectRaw('status, marketplace, COUNT(*) as count')
            ->whereNotNull('status')
            ->where('status', '!=', 5)
            ->where('created_at', '>=', $inicioMes)
            ->groupBy('status')
            ->groupBy('marketplace')
            ->orderBy('status', 'ASC')
            ->orderBy('marketplace', 'ASC')
            ->get();

        /**
         * Organiza os marketplaces
         */
        $marketplaces = [];
        foreach ($pedidos as $pedido) {
            if (!in_array(strtoupper($pedido->marketplace), $marketplaces)) {
                $marketplaces[] = strtoupper($pedido->marketplace);
            }
        }

        /**
         * Status possíveis
         */
        $status = \Config::get('core.pedido_status');

        /**
         * Prepara a lista para quando não existir preenche corretamente com 0
         */
        $list = [];
        foreach ($status as $state) {
            foreach ($marketplaces as $marketplace) {
                $list[strtolower($state)][] = 0;
            }
        }

        /**
         * Organiza os dados pra mostrar no gráfico
         */
        foreach ($pedidos as $pedido) {
            $list[strtolower($status[$pedido->status])][array_search(strtoupper($pedido->marketplace), $marketplaces)] = $pedido->count;
        }

        /**
         * Altera o nome do marketplace
         */
        if ($index = array_search('MERCADOLIVRE', $marketplaces)) {
            $marketplaces[$index] = 'M.LIVRE';
        }

        $list['marketplaces'] = $marketplaces;

        return $this->listResponse($list);
    }

    /**
     * Retorna o total de pedidos pagos, entregues e enviados no dia mes e ano atual, bem como seu anterior imediato
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function totalOrdersByDate()
    {
        $data = [
            'ano' => (int)date('Y'),
            'mes' => (int)date('m'),
            'dia' => (int)date('d'),
        ];

       /*$ano = Pedido
            ::selectRaw('YEAR(created_at) as ano, COUNT(*) as count')
            ->whereIn('status', [1,2,3])
            ->whereIn(DB::raw('YEAR(created_at)'), [$data['ano'], $data['ano'] - 1])
            ->groupBy(DB::raw('YEAR(created_at)'))
            ->orderBy(DB::raw('YEAR(created_at)'), 'DESC')
            ->get()->toArray();

        if (count($ano) == 1 && $data['ano'] == $ano[0]['ano']) {
            $ano[] = [
                'ano' => $data['ano'] - 1,
                'count' => 0
            ];
        }*/

       $mes = Pedido
            ::selectRaw('MONTH(created_at) as mes, COUNT(*) as count')
            ->whereIn('status', [1,2,3])
            ->whereIn(DB::raw('MONTH(created_at)'), [$data['mes'], $data['mes'] - 1])
            ->where(DB::raw('YEAR(created_at)'), '=', $data['ano'])
            ->groupBy(DB::raw('MONTH(created_at)'))
            ->orderBy(DB::raw('MONTH(created_at)'), 'DESC')
            ->get()->toArray();

        if (!isset($mes[0])) {
            $mes[] = [
                'mes'   => $data['mes'],
                'count' => 0
            ];
        }

        if (count($mes) == 1) {
            if ($data['mes'] == $mes[0]['mes']) {
                $mes[] = [
                    'mes'   => $data['mes'] - 1,
                    'count' => 0
                ];
            } elseif (($data['mes'] - 1) == $mes[0]['mes']) {
                $mes[] = $mes[0];

                $mes[0] = [
                    'mes'   => $data['mes'],
                    'count' => 0
                ];
            }
        }

        if ($mes[1]['mes'] === 0) {
           $mes[1]['count'] = Pedido
                ::selectRaw('MONTH(created_at) as mes, COUNT(*) as count')
                ->whereIn('status', [1,2,3])
                ->where(DB::raw('MONTH(created_at)'), '=', 12)
                ->where(DB::raw('YEAR(created_at)'), '=', ($data['ano'] - 1))
                ->groupBy(DB::raw('MONTH(created_at)'))
                ->orderBy(DB::raw('MONTH(created_at)'), 'DESC')
                ->get()->toArray();

            $mes[1]['count'] = $mes[1]['count'][0]['count'];
            $mes[1]['mes']   = 12;
        }

        $dia = Pedido
            ::selectRaw('DAY(created_at) as dia, COUNT(*) as count')
            ->whereIn('status', [1,2,3])
            ->whereIn(DB::raw('DAY(created_at)'), [$data['dia'], $data['dia'] - 1])
            ->where(DB::raw('MONTH(created_at)'), '=', $data['mes'])
            ->where(DB::raw('YEAR(created_at)'), '=', $data['ano'])
            ->groupBy(DB::raw('DAY(created_at)'))
            ->orderBy(DB::raw('DAY(created_at)'), 'DESC')
            ->get()->toArray();

        if (!isset($dia[0])) {
            $dia[] = [
                'dia'   => $data['dia'],
                'count' => 0
            ];
        }

        if (count($dia) == 1) {
            if ($data['dia'] == $dia[0]['dia']) {
                $dia[] = [
                    'dia'   => $data['dia'] - 1,
                    'count' => 0
                ];
            } elseif (($data['dia'] - 1) == $dia[0]['dia']) {
                $dia[] = $dia[0];

                $dia[0] = [
                    'dia'   => $data['dia'],
                    'count' => 0
                ];
            }
        }

        $mesesExtenso = Config::get('core.meses');

        $pedidos = [
            /*'ano' => [
                'atual' => [$ano[0]['ano'], $ano[0]['count']],
                'ultimo' => [$ano[1]['ano'], $ano[1]['count']],
            ],*/
            'mes' => [
                'atual'  => [$mesesExtenso[(int)$mes[0]['mes']], $mes[0]['count']],
                'ultimo' => [$mesesExtenso[(int)$mes[1]['mes']], $mes[1]['count']],
            ],
            'dia' => [
                'atual'  => [$dia[0]['dia'], $dia[0]['count']],
                'ultimo' => [$dia[1]['dia'], $dia[1]['count']],
            ]
        ];

        return $this->listResponse($pedidos);
    }

    /**
     * Retorna o total de pedidos pagos, enviados e entregues por dia no mês/ano atual ou por parâmetro
     *
     * @param  int $mes
     * @param  int $ano
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function totalOrders($mes = null, $ano = null)
    {
        $atual = false;

        if ($mes === null) {
            $mes   = (int)date('m');
            $atual = true;
        }

        if ($ano === null) {
            $ano = (int)date('Y');
        }

        $pedidos = Pedido
            ::selectRaw('DAY(created_at) AS dia, COUNT(*) as total')
            ->whereIn('status', [1,2,3])
            ->where(DB::raw('MONTH(created_at)'), '=', $mes)
            ->where(DB::raw('YEAR(created_at)'), '=', $ano)
            ->groupBy(DB::raw('DAY(created_at)'))
            ->orderBy(DB::raw('DAY(created_at)'), 'ASC')
            ->get()->toArray();

        $lastDay = cal_days_in_month(CAL_GREGORIAN, $mes, $ano);
        $days = range(1, (($atual) ? date('d') : $lastDay));
        $list = array_fill_keys(array_keys(array_flip($days)), 0);
        foreach ($pedidos as $pedido) {
            $list[$pedido['dia']] = $pedido['total'];
        }

        $list = [
            'mes'  => $mes,
            'ano'  => $ano,
            'name' => Config::get('core.meses')[$mes],
            'data' => array_values($list)
        ];

        return $this->listResponse($list);
    }

    public function cidades($uf)
    {
        try {
            $list = Pedido
                ::selectRaw('DISTINCT(cliente_enderecos.cidade)')
                ->join('cliente_enderecos', 'cliente_enderecos.id', '=', 'pedidos.cliente_endereco_id')
                ->with('endereco')
                ->where('cliente_enderecos.uf', '=', $uf)
                ->orderBy('cliente_enderecos.cidade', 'ASC')
                ->get()
                ->toArray();

            foreach ($list as $key => $item) {
                $list[$key] = ucwords(strtolower(array_values(array_intersect_key($item, ['cidade' => '']))[0]));
            }

            return $this->listResponse($list);
        } catch (\Exception $exception) {
            return $this->clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    public function imagemCancelamento($id)
    {
        if ($pedido = (self::MODEL)::find($id)) {
            $file_path = storage_path('app/public/cancelamento/' . $pedido->imagem_cancelamento);

            if (file_exists($file_path)) {
                return response()->make(file_get_contents($file_path), '200')->header('Content-Type', 'image/' . (pathinfo($file_path, PATHINFO_EXTENSION) ?: 'jpeg'));
            }
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
        try {
            DB::beginTransaction();
            Log::debug('Transaction - begin');

            $order = (self::MODEL)::create(Input::except([
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
