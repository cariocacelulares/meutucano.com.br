<?php namespace App\Http\Controllers\Senha;

use App\Http\Controllers\RestControllerTrait;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Models\UsuarioSenha;
use Tymon\JWTAuth\Facades\JWTAuth;

/**
 * Class UsuarioSenhaController
 * @package App\Http\Controllers\Interno
 */
class UsuarioSenhaController extends Controller
{
    use RestControllerTrait;

    const MODEL = UsuarioSenha::class;

    protected $validationRules = [];

    /**
     * Return password from user
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function userPassword($id)
    {
        $m = self::MODEL;

        $list = $m::where('usuario_id', $id);
        $list = $this->handleRequest($list);

        return $this->listResponse($list);
    }
}