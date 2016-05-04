<?php namespace App\Http\Controllers\Pedido;

use App\Http\Controllers\RestControllerTrait;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\ClienteEndereco;
use App\Models\Pedido;
use App\Models\PedidoImposto;
use App\Models\PedidoNota;
use App\Models\PedidoProduto;
use App\Models\PedidoRastreio;
use App\Models\Produto;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Input;

/**
 * Class PedidoController
 * @package App\Http\Controllers\Pedido
 */
class PedidoController extends Controller
{
    use RestControllerTrait;

    const MODEL = Pedido::class;

    protected $validationRules = [];
}