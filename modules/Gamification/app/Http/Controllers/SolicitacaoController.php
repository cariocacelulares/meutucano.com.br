<?php namespace Gamification\Http\Controllers;

use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Rest\RestControllerTrait;
use Gamification\Models\Solicitacao;
use Gamification\Models\Tarefa;
use Gamification\Models\UsuarioTarefa;

/**
 * Class SolicitacaoController
 * @package Gamification\Http\Controllers
 */
class SolicitacaoController extends Controller
{
    use RestControllerTrait;

    const MODEL = Solicitacao::class;

    public function tableList()
    {
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
        } catch (\Exception $ex) {
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
        } catch (\Exception $ex) {
            \Log::error(logMessage($ex, 'Erro ao atualizar recurso'), ['model' => self::MODEL]);

            $data = ['exception' => $ex->getMessage()];
            return $this->clientErrorResponse($data);
        }
    }
}
