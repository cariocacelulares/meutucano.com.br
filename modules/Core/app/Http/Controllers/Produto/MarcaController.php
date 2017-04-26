<?php namespace Core\Http\Controllers\Produto;

use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use Core\Models\Produto\Marca;

/**
 * Class MarcaController
 * @package Core\Http\Controllers\Produto
 */
class MarcaController extends Controller
{
    use RestControllerTrait;

    const MODEL = Marca::class;

    public function __construct()
    {
        $this->middleware('permission:brand_list', ['only' => ['index']]);
        $this->middleware('permission:brand_show', ['only' => ['show']]);
        $this->middleware('permission:brand_create', ['only' => ['store']]);
        $this->middleware('permission:brand_update', ['only' => ['update']]);
        $this->middleware('permission:brand_delete', ['only' => ['destroy']]);
    }

    /**
     * Lista marcas para a tabela
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function tableList()
    {
        $this->middleware('permission:brand_list');

        $list = Marca::orderBy('marcas.created_at', 'DESC');
        $list = $this->handleRequest($list);

        return $this->listResponse($list);
    }
}
