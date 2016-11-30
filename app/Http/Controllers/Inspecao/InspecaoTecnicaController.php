<?php namespace App\Http\Controllers\Inspecao;

use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use App\Models\Produto\Produto;
use App\Models\Pedido\PedidoProduto;
use App\Models\Inspecao\InspecaoTecnica;
use Illuminate\Support\Facades\Input;

/**
 * Class InspecaoTecnicaController
 * @package App\Http\Controllers\Inspecao
 */
class InspecaoTecnicaController extends Controller
{
    use RestControllerTrait;

    const MODEL = InspecaoTecnica::class;

    protected $validationRules = [];

    /**
     * Lista inspecoes para a tabela
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function tableList() {
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

        return $this->listResponse($list);
    }

    /**
     * Retorna a fila de inspecoes a serem realizadas
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function fila() {
        $m = self::MODEL;

        $list = $m
            ::leftJoin('produtos', 'produtos.sku', '=', 'inspecao_tecnica.produto_sku')
            ->leftJoin('pedido_produtos', 'pedido_produtos.id', '=', 'inspecao_tecnica.pedido_produtos_id')
            ->leftJoin('pedidos', 'pedidos.id', '=', 'pedido_produtos.pedido_id')
            ->leftJoin('usuarios', 'usuarios.id', '=', 'inspecao_tecnica.solicitante_id')
            ->with(['produto', 'pedido_produto', 'pedido_produto.pedido', 'solicitante'])
            ->whereNotNull('inspecao_tecnica.produto_sku')
            ->whereNull('inspecao_tecnica.revisado_at')
            ->where(function($query) {
                    $query->whereNotNull('inspecao_tecnica.pedido_produtos_id')
                        ->orWhereNotNull('reservado');
            })
            ->orderBy('inspecao_tecnica.priorizado', 'DESC')
            ->orderBy('pedidos.status', 'DESC')
            ->orderBy('inspecao_tecnica.created_at', 'ASC');

        $list = $this->handleRequest($list);

        return $this->listResponse($list);
    }

    /**
     * Retorna as inspecoes solicitadas pelo usuario atual
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function solicitadas() {
        $m = self::MODEL;

        $list = $m
            ::with('produto')
            ->leftJoin('produtos', 'produtos.sku', '=', 'inspecao_tecnica.produto_sku')
            ->where('solicitante_id', '=', getCurrentUserId())
            ->orderBy('priorizado', 'DESC')
            ->orderBy('created_at', 'DESC');

        $list = $this->handleRequest($list);

        return $this->listResponse($list);
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
            $v = \Validator::make(Input::all(), $this->validationRules);

            if ($v->fails()) {
                throw new \Exception("ValidationException");
            }

            $data = $m::create(array_merge([
                'usuario_id' => getCurrentUserId(),
                'revisado_at' => date('Y-m-d H:i:s')
            ], Input::all()));

            return $this->createdResponse($data);
        } catch(\Exception $ex) {
            $data = ['form_validations' => $v->errors(), 'exception' => $ex->getMessage()];

            \Log::error(logMessage($ex, 'Erro ao salvar recurso'), ['model' => self::MODEL]);
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
            $v = \Validator::make(Input::all(), $this->validationRules);

            if ($v->fails()) {
                throw new \Exception("ValidationException");
            }

            $data->fill(Input::all());

            if (!$data->usuario_id && $data->getOriginal('priorizado') == $data->priorizado) {
                $data->usuario_id = getCurrentUserId();
                $data->revisado_at = date('Y-m-d H:i:s');
            }

            $data->save();
            return $this->showResponse($data);
        } catch(\Exception $ex) {
            \Log::error(logMessage($ex, 'Erro ao atualizar recurso'), ['model' => self::MODEL]);

            $data = ['form_validations' => $v->errors(), 'exception' => $ex->getMessage()];
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
            $v = \Validator::make(Input::all(), $this->validationRules);

            if ($v->fails()) {
                throw new \Exception("ValidationException");
            }

            foreach ($data as $inspecao) {
                $inspecao->priorizado = !((int) $inspecao->priorizado);
                $inspecao->save();
            }

            return $this->showResponse($data);
        } catch (\Exception $e) {
            \Log::error(logMessage($ex, 'Erro ao atualizar recurso'), ['model' => self::MODEL]);
            $data = ['form_validations' => $v->errors(), 'exception' => $ex->getMessage()];
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
}