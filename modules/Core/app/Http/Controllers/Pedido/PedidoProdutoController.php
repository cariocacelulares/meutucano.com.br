<?php namespace Core\Http\Controllers\Pedido;

use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use Core\Models\Pedido\PedidoProduto;
use Core\Transformers\OrderProductTransformer;

/**
 * Class PedidoProdutoController
 * @package Core\Http\Controllers\Pedido
 */
class PedidoProdutoController extends Controller
{
    use RestControllerTrait;

    const MODEL = PedidoProduto::class;

    public function __construct()
    {
        $this->middleware('permission:order_update', [
            'only' => ['store', 'update', 'destroy']
        ]);
    }

    /**
     * Lists pending orders by sku
     *
     * @param  int $sku
     * @return response
     */
    public function listBySku($sku)
    {
        $orderProducts = PedidoProduto::with(['pedido'])
            ->join('pedidos', 'pedidos.id', '=', 'pedido_produtos.pedido_id')
            ->where('produto_sku', '=', $sku)
            ->whereIn('pedidos.status', [0,1])
            ->orderBy('pedidos.status', 'ASC')
            ->get();

        return $this->listResponse(OrderProductTransformer::listBySku($orderProducts));
    }

    /**
     * Retorna um único recurso
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function show($id)
    {
        $data = PedidoProduto::with('produto')->where('id', '=', $id)->first();

        if ($data) {
            return $this->showResponse($data);
        }

        return $this->notFoundResponse();
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
            $data = PedidoProduto::findOrFail($id);

            $data->fill(Input::all());
            $data->save();

            $data = PedidoProduto::with('produto')->where('id', '=', $data->id)->first();

            return $this->showResponse($data);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao atualizar recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }
}
