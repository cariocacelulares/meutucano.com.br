<?php namespace App\Http\Controllers\Inspecao;

use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
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
            ->whereNotNull('inspecao_tecnica.imei')
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
            ->whereNotNull('inspecao_tecnica.pedido_produtos_id')
            ->whereNull('inspecao_tecnica.imei')
            ->orderBy('inspecao_tecnica.priorizado', 'DESC')
            ->orderBy('pedidos.status', 'DESC')
            ->orderBy('inspecao_tecnica.created_at', 'ASC');

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

            $data = $m::create(array_merge(Input::all(), ['usuario_id' => getCurrentUserId()]));

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

            if (!$data->usuario_id) {
                $data->usuario_id = getCurrentUserId();
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

        if (!$data = $m::where('pedido_produtos_id', '=', $id)->whereNull('imei')->get()) {
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
}