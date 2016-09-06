<?php namespace App\Http\Controllers\Cliente;

use Carbon\Carbon;
use App\Http\Controllers\RestControllerTrait;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Models\ClienteEndereco;
use Illuminate\Support\Facades\Input;

/**
 * Class EnderecoController
 * @package App\Http\Controllers\Cliente
 */
class EnderecoController extends Controller
{
    use RestControllerTrait;

    const MODEL = ClienteEndereco::class;

    protected $validationRules = [];
}