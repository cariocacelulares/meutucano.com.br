<?php namespace Core\Http\Controllers\Produto;

use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use Core\Models\Produto\Linha;
use Core\Models\Produto\Linha\Atributo;
use Core\Models\Produto\Linha\Atributo\Opcao;
use Illuminate\Support\Facades\Input;
use Illuminate\Http\Request;

/**
 * Class LinhaController
 * @package Core\Http\Controllers\Produto
 */
class LinhaController extends Controller
{
    use RestControllerTrait;

    const MODEL = Linha::class;

    public function __construct()
    {
        $this->middleware('permission:line_list', ['only' => ['index']]);
        $this->middleware('permission:line_show', ['only' => ['show']]);
        $this->middleware('permission:line_create', ['only' => ['store']]);
        $this->middleware('permission:line_update', ['only' => ['update']]);
        $this->middleware('permission:line_delete', ['only' => ['destroy']]);
    }

    /**
     * Lista linhas para a tabela
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function tableList()
    {
        $this->middleware('permission:line_list');

        $list = Linha::orderBy('linhas.created_at', 'DESC');
        $list = $this->handleRequest($list);

        return $this->listResponse($list);
    }
}
