<?php namespace App\Http\Controllers\Interno;

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
        return $this->listResponse($m::where('usuario_id', $id)->get());
    }

    /**
     * Return current user passwords
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function currentUserPasswords()
    {
        $m = self::MODEL;
        $senhas = $m::where('usuario_id', JWTAuth::parseToken()->authenticate()->id)->get();

        return $this->listResponse($senhas);
    }
}