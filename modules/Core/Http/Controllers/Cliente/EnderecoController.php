<?php namespace Modules\Core\Http\Controllers\Cliente;

use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use Modules\Core\Models\Cliente\Endereco;
use Modules\Core\Models\Cliente\Cliente;

/**
 * Class EnderecoController
 * @package Modules\Core\Http\Controllers\Cliente
 */
class EnderecoController extends Controller
{
    use RestControllerTrait;

    const MODEL = Endereco::class;

    protected $validationRules = [];
}