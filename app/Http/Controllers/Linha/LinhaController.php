<?php namespace App\Http\Controllers\Linha;

use Carbon\Carbon;
use App\Http\Controllers\RestControllerTrait;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Models\Linha;
use Illuminate\Support\Facades\Input;
use Illuminate\Http\Request;

/**
 * Class LinhaController
 * @package App\Http\Controllers\Linha
 */
class LinhaController extends Controller
{
    use RestControllerTrait;

    const MODEL = Linha::class;

    protected $validationRules = [];

    /**
     * Lista linhas para a tabela
     * 
     * @return \Symfony\Component\HttpFoundation\Response 
     */
    public function tableList() {
        $m = self::MODEL;

        $list = $m::orderBy('linhas.created_at', 'DESC');

        $list = $this->handleRequest($list);

        return $this->listResponse($list);
    }
}