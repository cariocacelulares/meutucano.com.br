<?php namespace Core\Http\Controllers\Produto;

use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use Core\Models\Produto\ProductStock;

/**
 * Class ProductStockController
 * @package Core\Http\Controllers\Produto
 */
class ProductStockController extends Controller
{
    use RestControllerTrait;

    const MODEL = ProductStock::class;

    /**
     * Atualiza um recurso
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function update($id)
    {
        try {
            $productStock = (self::MODEL)::findOrFail($id);

            $data = Input::all();

            if (isset($data['quantity'])
                && $data['quantity'] !== $productStock->quantity
                && $productStock->serial_enabled
            ) {
                unset($data['quantity']);
            }

            $productStock->fill($data);
            $productStock->save();

            return $this->showResponse($productStock);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao atualizar recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse([
                'exception' => $exception->getMessage()
            ]);
        }
    }
}
