<?php namespace App\Http\Controllers\Usuario;

use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use App\Models\Usuario\Senha;
use Tymon\JWTAuth\Facades\JWTAuth;

/**
 * Class SenhaController
 * @package App\Http\Controllers\Interno
 */
class SenhaController extends Controller
{
    use RestControllerTrait;

    const MODEL = Senha::class;

    public function __construct()
    {
        $this->middleware('permission:user_password_list', ['only' => ['index']]);
        $this->middleware('permission:user_password_show', ['only' => ['show']]);
        $this->middleware('permission:user_password_create', ['only' => ['store']]);
        $this->middleware('permission:user_password_update', ['only' => ['update']]);
        $this->middleware('permission:user_password_delete', ['only' => ['destroy']]);
    }

    /**
     * Return passwords from user
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function userPassword($id)
    {
        $this->middleware('permission:user_password_list');

        return $this->listResponse($this->listPasswords($id));
    }

    /**
     * Return passwords from current users
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function currentUserPassword()
    {
        $this->middleware('permission:user_password_list_mine');

        $id = JWTAuth::parseToken()->authenticate()->id;

        return $this->listResponse($this->listPasswords($id));
    }

    /**
     * Reutn passwords form user
     *
     * @param  int $user_id
     * @return Object
     */
    private function listPasswords($user_id)
    {
        $this->middleware('permission:user_password_list');

        $list = Senha::where('usuario_id', $user_id);

        return $this->handleRequest($list);
    }
}
