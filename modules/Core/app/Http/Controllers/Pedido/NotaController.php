<?php namespace Core\Http\Controllers\Pedido;

use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Mail;
use NFePHP\Extras\Danfe;
use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use Core\Http\Controllers\Pedido\PedidoController;
use Core\Models\Pedido\Nota;
use Core\Models\Pedido\Nota\Devolucao;
use Core\Http\Requests\Nota\DeleteRequest;

/**
 * Class NotaController
 * @package Core\Http\Controllers\Pedido
 */
class NotaController extends Controller
{
    use RestControllerTrait;

    const MODEL = Nota::class;

    public function __construct()
    {
        $this->middleware('permission:order_invoice_list', ['only' => ['index']]);
        $this->middleware('permission:order_invoice_show', ['only' => ['show']]);
        $this->middleware('permission:order_invoice_create', ['only' => ['store']]);
        $this->middleware('permission:order_invoice_update', ['only' => ['update']]);
        $this->middleware('permission:order_invoice_delete', ['only' => ['destroy']]);
    }

    /**
     * Deleta um recurso
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function destroy($id, DeleteRequest $request)
    {
        try {
            $nota = Nota::findOrFail($id);

            $nota->delete_note = Input::get('delete_note');
            $nota->save();

            $nota->delete();

            \Log::info('return_stock', [Input::get('return_stock')]);

            if (Input::get('return_stock')) {
                $orderProducts = $nota->pedido->produtos;
                \Log::info('$orderProducts', [$orderProducts]);

                foreach ($orderProducts as $orderProduct) {
                    \Log::info('$orderProduct', [$orderProduct]);
                    $stock = $orderProduct->productStock->stock_slug;
                    \Log::info('$stock', [$stock]);
                    \Stock::add($orderProduct->produto_sku, 1, $stock);
                }
            }

            return $this->deletedResponse();
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao excluir recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * Generate DANFe PDF file
     *
     * @param  $id
     * @param  string  $returnType I-borwser, S-retorna o arquivo, D-força download, F-salva em arquivo local
     * @param  string  $dir        path dir i $returnType is F
     * @return Response
     */
    public function danfe($id, $returnType = 'I', $path = false)
    {
        $this->middleware('permission:order_invoice_print');

        $invoice = Nota::findOrFail($id);

        return \Invoice::danfe($invoice->arquivo, $returnType, $path);
    }

    /**
     * Envia os dados de faturamento
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function faturar($pedido_id)
    {
        return with(new PedidoController())->faturar($pedido_id);
    }
}
