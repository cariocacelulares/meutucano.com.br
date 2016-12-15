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

    protected $validationRules = [];

    /**
     * Return passwords from user
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function userPassword($id)
    {
        return $this->listResponse($this->listPasswords($id));
    }

    /**
     * Return passwords from current users
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function currentUserPassword()
    {
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
        $m = self::MODEL;
        $list = $m::where('usuario_id', $user_id);
        return $this->handleRequest($list);
    }
}
