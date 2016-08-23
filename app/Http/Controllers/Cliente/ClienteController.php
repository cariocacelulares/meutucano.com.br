<?php namespace App\Http\Controllers\Cliente;

use Carbon\Carbon;
use App\Http\Controllers\RestControllerTrait;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Models\Cliente;

/**
 * Class ClienteController
 * @package App\Http\Controllers\Cliente
 */
class ClienteController extends Controller
{
    use RestControllerTrait;

    const MODEL = Cliente::class;

    protected $validationRules = [];

    /**
     * Lista pedidos para a tabela
     * 
     * @return \Symfony\Component\HttpFoundation\Response 
     */
    public function tableList() {
        $m = self::MODEL;

        $list = $m::orderBy('clientes.created_at', 'DESC');

        $list = $this->handleRequest($list);

        return $this->listResponse($list);
    }
}