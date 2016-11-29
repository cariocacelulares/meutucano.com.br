<?php namespace Modules\Core\Http\Controllers\Produto;

use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use Modules\Core\Models\Produto\Produto;
use Modules\Core\Models\Pedido\PedidoProduto;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\DB;
use Modules\InspecaoTecnica\Models\InspecaoTecnica;

/**
 * Class ProdutoController
 * @package Modules\Core\Http\Controllers\Produto
 */
class ProdutoController extends Controller
{
    use RestControllerTrait;

    const MODEL = Produto::class;

    protected $validationRules = [];

    /**
     * Lista produtos para a tabela
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function tableList() {
        $m = self::MODEL;

        $list = $m
            // ::with('linha')
            // ->with('marca')
            ::where('produtos.ativo', true)
            ->orderBy('produtos.created_at', 'DESC');

        $list = $this->handleRequest($list);

        $ids = [];
        foreach ($list as $item) {
            $ids[] = $item->sku;
        }

        $reservados = PedidoProduto
             ::select('pedido_produtos.produto_sku', 'pedidos.status', DB::raw('COUNT(*) as count'))
            ->join('pedidos', 'pedidos.id', '=', 'pedido_produtos.pedido_id')
            ->with(['pedido'])
            ->whereIn('pedido_produtos.produto_sku', $ids)
            ->whereIn('pedidos.status', [0,1])
            ->groupBy('pedido_produtos.produto_sku')
            ->groupBy('pedidos.status')
            ->orderBy('pedido_produtos.produto_sku')
            ->get()
            ->toArray();

        $attachedProducts = [];
        foreach ($reservados as $item) {
            $attachedProducts[$item['produto_sku']][$item['status']] = $item['count'];
        }

        foreach ($list as $item) {
            $item->attachedProducts = [
                (isset($attachedProducts[$item->sku][0]) ? $attachedProducts[$item->sku][0] : 0),
                (isset($attachedProducts[$item->sku][1]) ? $attachedProducts[$item->sku][1] : 0)
            ];
        }

        return $this->listResponse($list);
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
        $data = $m::find($id);

        $pedidoProdutos = PedidoProduto
             ::select('pedidos.status', DB::raw('COUNT(*) as count'))
            ->join('pedidos', 'pedidos.id', '=', 'pedido_produtos.pedido_id')
            ->where('produto_sku', '=', $data->sku)
            ->whereIn('pedidos.status', [0,1])
            ->groupBy('pedidos.status')
            ->get()
            ->toArray();

        $attachedProducts = [];
        foreach ($pedidoProdutos as $pedidoProduto) {
            $attachedProducts[$pedidoProduto['status']] = $pedidoProduto['count'];
        }

        $data->attachedProducts = $attachedProducts;

        if ($data) {
            $revisoes = InspecaoTecnica
                ::where('produto_sku', '=', $data->sku)
                ->whereNull('pedido_produtos_id')
                ->whereNotNull('revisado_at')
                ->get(['id']);

            $data->revisoes = $revisoes ?: false;

            return $this->showResponse($data);
        }

        return $this->notFoundResponse();
    }

    /**
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function gerenateSku($oldSku = null)
    {
        $m = self::MODEL;

        try {
            if (!$oldSku) {
                $data = new Produto();
            } else {
                $data = $m::find($oldSku);
                if (!$data) {
                    return $this->notFoundResponse();
                }

                $last = Produto::orderBy('sku', 'DESC')->take(1)->first();

                if ($last && $last->sku) {
                    $last = (int)$last->sku;
                    $last++;
                } else {
                    throw new \Exception('Não foi possível encontrar o último SKU válido!', 1);
                }
                $data->sku = $last;

                DB::unprepared('ALTER TABLE ' . $data->getTable() . ' AUTO_INCREMENT = ' . ($last + 1) . ';');
            }

            $data->save();

            return $this->showResponse($data);
        } catch(\Exception $ex) {
            $data = ['exception' => $ex->getMessage()];
            return $this->clientErrorResponse($data);
        }
    }

    /**
     * Check if sku exists
     *
     * @param  int $sku
     * @return bool      if exists
     */
    public function checkSku($sku)
    {
        try {
            if ($produto = Produto::find($sku)) {
                return $this->showResponse(['exists' => true]);
            }
        } catch (\Exception $e) {
        }

        return $this->showResponse(['exists' => false]);
    }

    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function store()
    {
        $m = self::MODEL;
        try {
            $v = \Validator::make(Input::all(), $this->validationRules);

            if($v->fails()) {
                throw new \Exception("ValidationException");
            }
            $data = $m::create(Input::all());
            return $this->createdResponse($data);
        } catch(\Exception $ex) {
            $data = ['form_validations' => $v->errors(), 'exception' => $ex->getMessage()];

            \Log::error(logMessage($ex));
            return $this->clientErrorResponse($data);
        }
    }

    /**
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

            $data->fill(Input::except(['atributos']));
            $data->save();

            $attrs = Input::get('atributos');
            if ($attrs) {
                $data->atributos()->detach();

                $atributos = [];
                foreach ($attrs as $attr) {
                    $atributos[] = [
                        'produto_sku' => (isset($attr['pivot']['produto_sku']) && $attr['pivot']['produto_sku']) ? $attr['pivot']['produto_sku'] : $data->sku,
                        'atributo_id' => (isset($attr['pivot']['atributo_id']) && $attr['pivot']['atributo_id']) ? $attr['pivot']['atributo_id'] : $attr['id'],
                        'opcao_id' => (isset($attr['pivot']['opcao_id']) && $attr['pivot']['opcao_id']) ? $attr['pivot']['opcao_id'] : null,
                        'valor' => (isset($attr['pivot']['valor']) && $attr['pivot']['valor']) ? $attr['pivot']['valor'] : null
                    ];
                }
                $data->atributos()->attach($atributos);
            }

            return $this->showResponse($data);
        } catch(\Exception $ex) {
            $data = ['form_validations' => $v->errors(), 'exception' => $ex->getMessage()];
            return $this->clientErrorResponse($data);
        }
    }

    /**
     * Busca produtos por sku ou titulo baseado no parametro
     *
     * @param  string $term termo a ser buscado
     * @return Object
     */
    public function search($term)
    {
        try {
            $estado = Input::get('estado');
            $estado = $estado ?: false;

            if ($estado) {
                $list = Produto::where('estado', '=', $estado);
                $list->whereRaw("(titulo LIKE '%{$term}%' OR sku LIKE '%{$term}%')");
            } else {
                $list = Produto::where('titulo', 'LIKE', "%{$term}%")->orWhere('sku', 'LIKE', "%{$term}%");
            }

            $list = $list->get(['produtos.sku', 'produtos.titulo'])->toArray();

            return $this->listResponse($list);
        } catch (\Exception $e) {
            return $this->listResponse([]);
        }
    }
}