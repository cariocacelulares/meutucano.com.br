<?php namespace Modules\Core\Http\Controllers\Pedido;

use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use Modules\Core\Models\Pedido\PedidoProduto;

/**
 * Class PedidoProdutoController
 * @package Modules\Core\Http\Controllers\Pedido
 */
class PedidoProdutoController extends Controller
{
    use RestControllerTrait;

    const MODEL = PedidoProduto::class;

    protected $validationRules = [];

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
}