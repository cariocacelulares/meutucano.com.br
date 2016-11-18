<?php namespace App\Http\Controllers\Gamification;

use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use App\Models\Gamification\Solicitacao;
use App\Models\Gamification\Tarefa;
use App\Models\Gamification\UsuarioTarefa;
use Illuminate\Support\Facades\Input;

/**
 * Class SolicitacaoController
 * @package App\Http\Controllers\Gamification
 */
class SolicitacaoController extends Controller
{
    use RestControllerTrait;

    const MODEL = Solicitacao::class;

    protected $validationRules = [];

    public function tableList() {
        $list = Solicitacao::with('usuario')
            ->join('usuarios', 'usuarios.id', '=', 'gamification_solicitacoes.usuario_id')
            ->join('gamification_tarefas', 'gamification_tarefas.id', '=', 'gamification_solicitacoes.tarefa_id')
            ->orderBy('gamification_solicitacoes.status', 'ASC')
            ->orderBy('gamification_solicitacoes.created_at', 'DESC');

        $filtros = json_decode(Input::get('filter'));
        foreach ($filtros as $key => $filtro) {
            if ($filtro->column == 'gamification_solicitacoes.status') {
                if (is_null($filtro->value) || $filtro->value == 'null') {
                    $list->where('gamification_solicitacoes.status', '=', null);

                    unset($filtros[$key]);
                    Input::replace(array('filter' => $filtros));
                }
            }
        }

        $list = $this->handleRequest($list);

        return $this->listResponse($list);
    }

    public function solicitar()
    {
        try {
            $data = Input::all();

            $data = Solicitacao::create(array_merge($data, [
                'usuario_id' => getCurrentUserId()
            ]));

            return $this->createdResponse($data);
        } catch(\Exception $ex) {
            $data = ['exception' => $ex->getMessage()];

            \Log::error(logMessage($ex, 'Erro ao salvar recurso'), ['model' => 'Solicitacao']);
            return $this->clientErrorResponse($data);
        }
    }

    public function update($id)
    {
        $m = self::MODEL;

        if (!$data = $m::find($id)) {
            return $this->notFoundResponse();
        }

        try {
            $v = \Validator::make(Input::all(), $this->validationRules);

            if ($v->fails()) {
                throw new \Exception("ValidationException");
            }

            $data->fill(Input::all());

            $aprovado = false;
            if (is_null($data->getOriginal('status')) && $data->status == 1) {
                $aprovado = true;
            }

            $data->save();
            $return = $this->showResponse($data);

            if ($aprovado) {
                UsuarioTarefa::create([
                    'usuario_id' => $data->usuario_id,
                    'tarefa_id' => $data->tarefa_id,
                    'experiencia' => $data->tarefa->experiencia,
                    'pontos' => $data->tarefa->pontos,
                    'moedas' => $data->tarefa->moedas,
                ]);
            }

            return $return;
        } catch(\Exception $ex) {
            \Log::error(logMessage($ex, 'Erro ao atualizar recurso'), ['model' => self::MODEL]);

            $data = ['form_validations' => $v->errors(), 'exception' => $ex->getMessage()];
            return $this->clientErrorResponse($data);
        }
    }
}