<?php namespace App\Http\Controllers\Usuario;

use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use App\Models\Usuario\Senha;

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

        $list = $m::where('usuario_id', $id);
        $list = $this->handleRequest($list);

        return $this->listResponse($list);
    }
}