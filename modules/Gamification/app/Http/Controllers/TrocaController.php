<?php namespace Gamification\Http\Controllers;

use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Rest\RestControllerTrait;
use Gamification\Models\Troca;
use Gamification\Models\Gamification;

/**
 * Class TrocaController
 * @package Gamification\Http\Controllers
 */
class TrocaController extends Controller
{
    use RestControllerTrait;

    const MODEL = Troca::class;

    protected $validationRules = [];

    /**
     * Lista conquistas para a tabela
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function tableList() {
        $m = self::MODEL;
        $list = $m::with('usuario')
            ->join('usuarios', 'usuarios.id', '=', 'gamification_trocas.usuario_id')
            ->join('gamification_recompensas', 'gamification_recompensas.id', '=', 'gamification_trocas.recompensa_id')
            ->orderBy('status', 'ASC')
            ->orderBy('gamification_trocas.created_at', 'DESC');

        $list = $this->handleRequest($list);

        return $this->listResponse($list);
    }

    public function store()
    {
        $m = self::MODEL;
        try {
            $v = \Validator::make(Input::all(), $this->validationRules);

            if ($v->fails()) {
                throw new \Exception("ValidationException");
            }

            $recompensa = Input::get('recompensa');

            $data = $m::create(array_merge(Input::all(), [
                'usuario_id' => getCurrentUserId(),
                'recompensa_id' => $recompensa['id'],
                'valor' => $recompensa['valor']
            ]));

            $return = $this->createdResponse($data);

            if ($data && $jogador = Gamification::where('usuario_id', '=', $data->usuario->id)->first()) {
                $jogador->moedas = ($jogador->moedas - $recompensa['valor']);
                $jogador->save();
            }

            return $return;
        } catch(\Exception $ex) {
            $data = ['form_validations' => $v->errors(), 'exception' => $ex->getMessage()];

            \Log::error(logMessage($ex, 'Erro ao salvar recurso'), ['model' => self::MODEL]);
            return $this->clientErrorResponse($data);
        }
    }
}