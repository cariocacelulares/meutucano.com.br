<?php namespace App\Http\Controllers\Pedido;

use App\Http\Controllers\RestControllerTrait;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Models\PedidoComentario;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Mail;
use NFePHP\Extras\Danfe;
use Tymon\JWTAuth\Facades\JWTAuth;

/**
 * Class PedidoNotaController
 * @package App\Http\Controllers\Pedido
 */
class PedidoComentarioController extends Controller
{
    use RestControllerTrait;

    const MODEL = PedidoController::class;

    protected $validationRules = [];
}
