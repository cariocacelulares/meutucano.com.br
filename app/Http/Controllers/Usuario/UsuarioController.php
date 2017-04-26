<?php namespace App\Http\Controllers\Usuario;

use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use App\Models\Usuario\Usuario;
use Illuminate\Support\Facades\Input;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Hash;

/**
 * Class UsuarioController
 * @package App\Http\Controllers\Interno
 */
class UsuarioController extends Controller
{
    use RestControllerTrait;

    const MODEL = Usuario::class;

    public function __construct()
    {
        $this->middleware('permission:user_list', ['only' => ['index']]);
        $this->middleware('permission:user_show', ['only' => ['show']]);
        $this->middleware('permission:user_create', ['only' => ['store']]);
        $this->middleware('permission:user_update', ['only' => ['update']]);
        $this->middleware('permission:user_delete', ['only' => ['destroy']]);
    }

    /**
     * Lista pedidos para a tabela
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function tableList()
    {
        $this->middleware('permission:user_list');

        $list = $this->handleRequest(new Usuario);

        return $this->listResponse($list);
    }
}
