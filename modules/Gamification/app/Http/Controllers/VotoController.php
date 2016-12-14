<?php namespace Gamification\Http\Controllers;

use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Rest\RestControllerTrait;
use Gamification\Models\Voto;

/**
 * Class VotoController
 * @package Gamification\Http\Controllers
 */
class VotoController extends Controller
{
    use RestControllerTrait;

    const MODEL = Voto::class;

    protected $validationRules = [];

    /**
     * Cria novo recurso
     *
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function store()
    {
        $m = self::MODEL;
        try {
            $v = \Validator::make(Input::all(), $this->validationRules);

            if ($v->fails()) {
                throw new \Exception("ValidationException");
            }

            $eleitor_id = getCurrentUserId();

            if ($eleitor_id == Input::get('candidato_id')) {
                return $this->createdResponse(['erro' => 'Você não pode votar em si mesmo!']);
            } else {
                $limite = \Config::get('gamification.votos_mes');
                $mes = date('m');
                $ano = date('Y');
                $ultimoDia = cal_days_in_month(CAL_GREGORIAN, $mes, $ano);
                $votos = Voto
                    ::where('eleitor_id', '=', $eleitor_id)
                    ->where('created_at', '>=', "{$ano}-{$mes}-01 00:00:00")
                    ->where('created_at', '<=', "{$ano}-{$mes}-{$ultimoDia} 23:59:59")
                    ->count();

                if ($votos >= $limite) {
                    return $this->createdResponse(['erro' => "Você já atingiu seu limite de votos este mês ({$limite})."]);
                } else {
                    $data = $m::create(array_merge(Input::all(), ['eleitor_id' => $eleitor_id]));

                    return $this->createdResponse($data);
                }
            }
        } catch(\Exception $ex) {
            $data = ['form_validations' => $v->errors(), 'exception' => $ex->getMessage()];

            \Log::error(logMessage($ex, 'Erro ao salvar recurso'), ['model' => self::MODEL]);
            return $this->clientErrorResponse($data);
        }
    }
}