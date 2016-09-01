<?php namespace App\Http\Controllers\Produto;

use Carbon\Carbon;
use App\Http\Controllers\RestControllerTrait;
use App\Http\Controllers\Controller;
use App\Models\Produto;
use Illuminate\Support\Facades\Input;

/**
 * Class ProdutoController
 * @package App\Http\Controllers\Produto
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
            ::with('linha')
            ->with('marca')
            ->where('ativo', true)
            ->orderBy('produtos.created_at', 'DESC');

        $list = $this->handleRequest($list);

        return $this->listResponse($list);
    }
}