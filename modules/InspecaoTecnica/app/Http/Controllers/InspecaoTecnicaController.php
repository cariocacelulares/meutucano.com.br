<?php namespace InspecaoTecnica\Http\Controllers;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Rest\RestControllerTrait;
use Core\Models\Produto\Produto;
use Core\Models\Pedido\PedidoProduto;
use InspecaoTecnica\Models\InspecaoTecnica;
use InspecaoTecnica\Transformers\InspecaoTecnicaTransformer;

/**
 * Class InspecaoTecnicaController
 * @package InspecaoTecnica\Http\Controllers
 */
class InspecaoTecnicaController extends Controller
{
    use RestControllerTrait;

    const MODEL = InspecaoTecnica::class;

    /**
     * Lista inspecoes para a tabela
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function tableList()
    {
        $m = self::MODEL;

        $list = $m
            ::leftJoin('produtos', 'produtos.sku', '=', 'inspecao_tecnica.produto_sku')
            ->leftJoin('pedido_produtos', 'pedido_produtos.id', '=', 'inspecao_tecnica.pedido_produtos_id')
            ->leftJoin('pedidos', 'pedidos.id', '=', 'pedido_produtos.pedido_id')
            ->leftJoin('usuarios as tecnico_table', 'tecnico_table.id', '=', 'inspecao_tecnica.usuario_id')
            ->leftJoin('usuarios as solicitante_table', 'solicitante_table.id', '=', 'inspecao_tecnica.solicitante_id')
            ->with(['produto', 'pedido_produto', 'pedido_produto.pedido', 'usuario', 'solicitante'])
            ->whereNotNull('inspecao_tecnica.revisado_at')
            ->orderBy('inspecao_tecnica.created_at', 'DESC');

        $list = $this->handleRequest($list);

        return $this->listResponse(InspecaoTecnicaTransformer::list($list));
    }

    /**
     * Retorna a fila de inspecoes a serem realizadas
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function fila()
    {
        $m = self::MODEL;

        $list = $m
            ::leftJoin('produtos', 'produtos.sku', '=', 'inspecao_tecnica.produto_sku')
            ->leftJoin('pedido_produtos', 'pedido_produtos.id', '=', 'inspecao_tecnica.pedido_produtos_id')
            ->leftJoin('pedidos', 'pedidos.id', '=', 'pedido_produtos.pedido_id')
            ->leftJoin('usuarios', 'usuarios.id', '=', 'inspecao_tecnica.solicitante_id')
            ->with(['produto', 'pedido_produto', 'pedido_produto.pedido', 'solicitante'])
            ->whereNotNull('inspecao_tecnica.produto_sku')
            ->whereNull('inspecao_tecnica.revisado_at')
            ->where(function ($query) {
                $query->whereNotNull('inspecao_tecnica.pedido_produtos_id')
                        ->orWhereNotNull('reservado');
            })
            ->orderBy('inspecao_tecnica.priorizado', 'DESC')
            ->orderBy('pedidos.status', 'DESC')
            ->orderBy('inspecao_tecnica.created_at', 'ASC');

        $list = $this->handleRequest($list);

        return $this->listResponse(InspecaoTecnicaTransformer::fila($list));
    }

    /**
     * Retorna as inspecoes solicitadas pelo usuario atual
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function solicitadas()
    {
        $m = self::MODEL;

        $list = $m
            ::with(['produto', 'pedido_produto', 'pedido_produto.pedido'])
            ->leftJoin('produtos', 'produtos.sku', '=', 'inspecao_tecnica.produto_sku')
            ->leftJoin('pedido_produtos', 'pedido_produtos.id', '=', 'inspecao_tecnica.pedido_produtos_id')
            ->leftJoin('pedidos', 'pedidos.id', '=', 'pedido_produtos.pedido_id')
            ->where('solicitante_id', '=', getCurrentUserId())
            ->orderBy('priorizado', 'DESC')
            ->orderBy('created_at', 'DESC');

        $list = $this->handleRequest($list);

        return $this->listResponse(InspecaoTecnicaTransformer::solicitadas($list));
    }

    /**
     * Cria novo recurso
     *
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function store()
    {
        $m = self::MODEL;

        try {
            $data = $m::create(array_merge([
                'usuario_id' => getCurrentUserId(),
                'revisado_at' => date('Y-m-d H:i:s')
            ], Input::all()));

            return $this->createdResponse($data);
        } catch (\Exception $ex) {
            $data = ['exception' => $ex->getMessage()];

            Log::error(logMessage($ex, 'Erro ao salvar recurso'), ['model' => self::MODEL]);
            return $this->clientErrorResponse($data);
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
        $m = self::MODEL;

        if (!$data = $m::find($id)) {
            return $this->notFoundResponse();
        }

        try {
            $data->fill(Input::all());

            if (!$data->usuario_id && $data->getOriginal('priorizado') == $data->priorizado) {
                $data->usuario_id = getCurrentUserId();
                $data->revisado_at = date('Y-m-d H:i:s');
            }

            $data->save();
            return $this->showResponse($data);
        } catch (\Exception $ex) {
            Log::error(logMessage($ex, 'Erro ao atualizar recurso'), ['model' => self::MODEL]);

            $data = ['exception' => $ex->getMessage()];
            return $this->clientErrorResponse($data);
        }
    }

    /**
     * Retorna um único recurso
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function show($id)
    {
        $m = self::MODEL;
        $data = $m::with('produto')->where('id', '=', $id)->first();

        if ($data) {
            return $this->showResponse($data);
        }

        return $this->notFoundResponse();
    }

    /**
     * Retorna uma inspecao
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function showByPedidoProduto($id)
    {
        $m = self::MODEL;
        $data = $m::with('produto')->where('pedido_produtos_id', '=', $id)->first();

        if ($data) {
            return $this->showResponse($data);
        }

        return $this->showResponse([]);
    }

    /**
     * Altera a prioridade da inspecao
     *
     * @param  int $id pedido_produtos_id
     * @return Object
     */
    public function changePriority($id)
    {
        $m = self::MODEL;

        if (!$pedidoProduto = PedidoProduto::find($id)) {
            return $this->notFoundResponse();
        }

        if (!$data = $m::where('pedido_produtos_id', '=', $id)->whereNull('revisado_at')->get()) {
            return $this->notFoundResponse();
        }

        try {
            foreach ($data as $inspecao) {
                $inspecao->priorizado = !((int) $inspecao->priorizado);
                $inspecao->save();
            }

            return $this->showResponse($data);
        } catch (\Exception $e) {
            Log::error(logMessage($ex, 'Erro ao atualizar recurso'), ['model' => self::MODEL]);
            $data = ['exception' => $ex->getMessage()];
            return $this->clientErrorResponse($data);
        }
    }

    /**
     * Verifica os ites de inpecao por produto e quntidade, retornando se deve reservar ou adicionar na fila
     *
     * @return Object
     */
    public function verificarReserva()
    {
        $acoes = [
            'reservar' => [
                'quantidade' => 0,
                'aplicar' => 0,
                'ids' => []
            ],
            'fila' => [
                'quantidade' => 0,
                'aplicar' => 0
            ],
            'sem_estoque' => [
                'quantidade' => 0,
                'aplicar' => 0
            ],
        ];

        $produto_sku = Input::get('produto');
        $quantidade = (int)Input::get('quantidade');

        if (!$produto = Produto::find($produto_sku)) {
            return $this->notFoundResponse();
        }

        // Pega os produtos já inspecionados disponiveis
        $inspecoes = InspecaoTecnica
            ::where('produto_sku', '=', $produto_sku)
            ->whereNull('pedido_produtos_id')
            ->whereNotNull('revisado_at')
            ->where('reservado', '=', false)
            ->take($quantidade)
            ->get();

        // Se tiver algum produto pronto
        if ($inspecoes->count() > 0) {
            foreach ($inspecoes as $inspecao) {
                $acoes['reservar']['quantidade']++;
                $quantidade--;
                $acoes['reservar']['ids'][] = $inspecao->id;
            }
        }

        // Se ainda sobraram produtos solicitados
        if ($quantidade > 0) {
            // Se tiver menos produtos em estoque do que foi solicitado
            if ($produto->estoque < $quantidade) {
                if ($produto->estoque > 0) {
                    $acoes['fila']['quantidade'] = $produto->estoque;
                }

                $acoes['sem_estoque']['quantidade'] = ($quantidade - $produto->estoque);
            } else {
                // Se tiver produtos o suficiente
                $acoes['fila']['quantidade'] = $quantidade;
            }
        }

        $acoes['reservar']['ids'] = implode(',', $acoes['reservar']['ids']);

        $acoes['reservar']['aplicar'] = ($acoes['reservar']['quantidade'] > 0) ? 1 : 0;
        $acoes['fila']['aplicar'] = ($acoes['fila']['quantidade'] > 0) ? 1 : 0;
        $acoes['sem_estoque']['aplicar'] = ($acoes['sem_estoque']['quantidade'] > 0) ? 1 : 0;

        return $this->listResponse($acoes);
    }

    /**
     * Reserva as inspecoes para o usuario atual
     *
     * @return Object
     */
    public function reservar()
    {
        $retorno = [];
        $produto_sku = Input::get('produto_sku');
        $reservar = Input::get('reservar');
        $fila = Input::get('fila');
        $semEstoque = Input::get('sem_estoque');

        if ($reservar['aplicar'] == 1) {
            $itensReservar = explode(',', $reservar['ids']);
            foreach ($itensReservar as $id) {
                $inspecao = InspecaoTecnica
                    ::where('id', '=', $id)
                    ->whereNull('pedido_produtos_id')
                    ->whereNotNull('revisado_at')
                    ->where('reservado', '=', false)
                    ->first();

                if (!$inspecao) {
                    // Tenta encontrar outra inspeção
                    $inspecao = InspecaoTecnica
                        ::where('produto_sku', '=', $produto_sku)
                        ->whereNull('pedido_produtos_id')
                        ->whereNotNull('revisado_at')
                        ->where('reservado', '=', false)
                        ->whereNotIn('id', $itensReservar)
                        ->first();

                    if ($inspecao) {
                        $inspecao->reservado = true;
                        $inspecao->solicitante_id = getCurrentUserId();
                        $inspecao->save();

                        $retorno[] = ['antigo' => $id, 'novo' => $inspecao->id];
                    } else {
                        $inspecao = InspecaoTecnica::create([
                            'produto_sku' => $produto_sku,
                            'reservado' => true,
                            'solicitante_id' => getCurrentUserId(),
                        ]);

                        $retorno[] = ['antigo' => $id, 'novo' => false];
                    }
                } else {
                    $inspecao->reservado = true;
                    $inspecao->solicitante_id = getCurrentUserId();
                    $inspecao->save();
                }
            }
        }

        if ($fila['aplicar'] == 1) {
            for ($i=0; $i < $fila['quantidade']; $i++) {
                $inspecao = InspecaoTecnica::create([
                    'produto_sku' => $produto_sku,
                    'reservado' => true,
                    'solicitante_id' => getCurrentUserId(),
                ]);
            }
        }

        if ($semEstoque['aplicar'] == 1) {
            for ($i=0; $i < $semEstoque['quantidade']; $i++) {
                $inspecao = InspecaoTecnica::create([
                    'produto_sku' => $produto_sku,
                    'reservado' => true,
                    'solicitante_id' => getCurrentUserId(),
                ]);
            }
        }

        return $this->listResponse(['dados' => $retorno]);
    }

    public function solicitar()
    {
        $orderProducts = Input::get('orderProducts');

        $return = [];

        foreach ($orderProducts as $orderProduct) {
            $qty = $orderProduct['quantidade'];
            if ($orderProduct = PedidoProduto::find($orderProduct['pedido_produtos_id'])) {
                for ($i=0; $i < $qty; $i++) {
                    $return[] = $this->attachInspecao($orderProduct);
                }
            }
        }

        return $this->listResponse($return);
    }

    /**
     * Adicona um pedidoProduto em uma inspecao existente ou cria uma nova
     * ATENÇÃO: ESSE MÉTODO NÃO CONSIDERA QUANTIDADE, CONSIDERA APENAS UMA DE CADA VEZ!
     *
     * @param  PedidoProduto $orderProduct contem o produto que precisa ser inspecionado
     * @return array|null
     */
    public function attachInspecao(PedidoProduto $orderProduct)
    {
        $product = $orderProduct->produto;
        $currentUser = getCurrentUserId();

        // Checa se é seminovo
        if ((int)$product->estado !== 1) {
            return null;
        }

        try {
            $inspecaoDisponivel = InspecaoTecnica
                ::where('inspecao_tecnica.produto_sku', '=', $product->sku)
                ->whereNull('inspecao_tecnica.pedido_produtos_id')
                ->whereNotNull('inspecao_tecnica.revisado_at')
                ->where('reservado', '=', false)
                ->orderBy('created_at', 'ASC')
                ->first();

            if ($inspecaoDisponivel) {
                $inspecaoDisponivel->pedido_produtos_id = $orderProduct->id;
                $inspecaoDisponivel->solicitante_id = $currentUser;
                if ($inspecaoDisponivel->save()) {
                    Log::notice('Inspecao tecnica adicionada ao pedido produto ' . $orderProduct->id, [$orderProduct, $inspecaoDisponivel]);
                    return [
                        'attach',
                        $inspecaoDisponivel->id,
                        InspecaoTecnica::with('produto')->where('id', '=', $inspecaoDisponivel->id)->first()
                    ];
                } else {
                    Log::warning('Erro ao tentar adicionar pedido produto na inspecao tecnica', [$orderProduct, $inspecaoDisponivel]);
                    return null;
                }
            }

            $inspecao = new InspecaoTecnica([
                'produto_sku' => $product->sku,
                'pedido_produtos_id' => $orderProduct->id,
                'solicitante_id' => $currentUser,
            ]);

            if ($inspecao->save()) {
                Log::notice('Inspecao tecnica adicioada na fila para o pedido produto ' . $orderProduct->id, [$orderProduct->toArray(), $inspecao->toArray()]);
                return [
                    'add',
                    $inspecao->id,
                    InspecaoTecnica::with('produto')->where('id', '=', $inspecao->id)->first()
                ];
            } else {
                Log::warning('Erro ao tentar cria inspecao tecnica', [$orderProduct]);
            }
        } catch (\Exception $exception) {
            Log::error(logMessage($exception, 'Erro ao tentar adicionar uma inspecao técnica!'), [$orderProduct]);
        }

        return null;
    }

    /**
     * Desassocia ou exclui uma inspecao com o pedido produto
     *
     * @param  PedidoProduto $orderProduct
     * @return void
     */
    public function detachInspecao(PedidoProduto $orderProduct, $onlyReviewed = false)
    {
        try {
            if ($onlyReviewed) {
                $inspection = InspecaoTecnica
                    ::where('inspecao_tecnica.pedido_produtos_id', '=', $orderProduct->id)
                    ->whereNotNull('revisado_at')
                    ->orderBy('created_at', 'DESC')
                    ->first();
            } else {
                $inspection = InspecaoTecnica
                    ::where('inspecao_tecnica.pedido_produtos_id', '=', $orderProduct->id)
                    ->orderBy('created_at', 'DESC')
                    ->first();
            }

            if ($inspection) {
                if ($inspection->revisado_at) {
                    $inspection->pedido_produtos_id = null;
                    if ($inspection->save()) {
                        Log::notice("Inspeção {$inspection->id} desassociada com o pedido produto.", [$inspection]);
                        return $this->listResponse([
                            ['detach', $inspection->id]
                        ]);
                    } else {
                        Log::warning('Erro ao tentar desassociar inspecao com o pedido produto.', [$inspection]);
                    }
                } else {
                    $id = $inspection->id;
                    $inspection->delete();
                    Log::notice("Inspeção {$id} excluida para o pedido produto " . (isset($orderProduct->id) ? $orderProduct->id : ''), [$inspection]);
                    return $this->listResponse([
                        ['delete']
                    ]);
                }
            }
        } catch (\Exception $exception) {
            Log::error(logMessage($exception, 'Erro ao tentar excluir/desassociar uma inspecao técnica!'), [$orderProduct]);
        }

        return $this->clientErrorResponse('Erro ao tentar excluir/desassociar pedido produto e inspecao tecnica');
    }
}
