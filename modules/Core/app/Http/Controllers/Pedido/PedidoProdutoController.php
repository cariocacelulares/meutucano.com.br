<?php namespace Core\Http\Controllers\Pedido;

use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use Core\Models\Pedido\PedidoProduto;

/**
 * Class PedidoProdutoController
 * @package Core\Http\Controllers\Pedido
 */
class PedidoProdutoController extends Controller
{
    use RestControllerTrait;

    const MODEL = PedidoProduto::class;

    /**
     * Retorna um único recurso
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function show($id)
    {
        $data = (self::MODEL)::with('produto')->where('id', '=', $id)->first();

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
            $data = (self::MODEL)::findOrFail($id);

            $data->fill(Input::all());
            $data->save();

            $data = (self::MODEL)::with('produto')->where('id', '=', $data->id)->first();

            return $this->showResponse($data);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao atualizar recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse([
                'exception' => $exception->getMessage()
            ]);
        }
    }
}
