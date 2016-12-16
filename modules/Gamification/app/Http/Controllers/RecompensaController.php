<?php namespace Gamification\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Rest\RestControllerTrait;
use Gamification\Models\Recompensa;

/**
 * Class RecompensaController
 * @package Gamification\Http\Controllers
 */
class RecompensaController extends Controller
{
    use RestControllerTrait;

    const MODEL = Recompensa::class;

    protected $validationRules = [];

    /**
     * Lista recompensas para a tabela
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function tableList()
    {
        $m = self::MODEL;
        $list = $m::orderBy('gamification_recompensas.nivel', 'ASC')
            ->orderBy('gamification_recompensas.valor', 'ASC')
            ->orderBy('gamification_recompensas.titulo', 'ASC');
        $list = $this->handleRequest($list);

        return $this->listResponse($list);
    }
}
