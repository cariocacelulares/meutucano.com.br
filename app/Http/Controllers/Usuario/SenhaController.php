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
     * Return password from user
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function userPassword($id)
    {
        $m = self::MODEL;

        if ($id == 0) {
            $id = JWTAuth::parseToken()->authenticate()->id;
        }

        $list = $m::where('usuario_id', $id);
        $list = $this->handleRequest($list);

        return $this->listResponse($list);
    }
}