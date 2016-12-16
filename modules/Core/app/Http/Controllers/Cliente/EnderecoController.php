<?php namespace Core\Http\Controllers\Cliente;

use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use Core\Models\Cliente\Endereco;
use Core\Models\Cliente\Cliente;

/**
 * Class EnderecoController
 * @package Core\Http\Controllers\Cliente
 */
class EnderecoController extends Controller
{
    use RestControllerTrait;

    const MODEL = Endereco::class;

    protected $validationRules = [];
}
