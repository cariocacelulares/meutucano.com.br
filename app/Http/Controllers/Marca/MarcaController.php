<?php namespace App\Http\Controllers\Marca;

use App\Http\Controllers\RestControllerTrait;
use App\Http\Controllers\Controller;
use App\Models\Marca;

/**
 * Class MarcaController
 * @package App\Http\Controllers\Marca
 */
class MarcaController extends Controller
{
    use RestControllerTrait;

    const MODEL = Marca::class;

    protected $validationRules = [];

    /**
     * Lista marcas para a tabela
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function tableList() {
        $m = self::MODEL;

        $list = $m::orderBy('marcas.created_at', 'DESC');

        $list = $this->handleRequest($list);

        return $this->listResponse($list);
    }
}