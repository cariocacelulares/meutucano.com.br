<?php namespace App\Http\Controllers\Cliente;

use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use App\Models\Cliente\Endereco;
use App\Models\Cliente\Cliente;

/**
 * Class EnderecoController
 * @package App\Http\Controllers\Cliente
 */
class EnderecoController extends Controller
{
    use RestControllerTrait;

    const MODEL = Endereco::class;

    protected $validationRules = [];
}