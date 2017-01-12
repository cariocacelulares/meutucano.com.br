<?php namespace Gamification\Http\Controllers;

use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Rest\RestControllerTrait;
use Gamification\Http\Controllers\Traits\SlugableTrait;
use Gamification\Models\Tarefa;

/**
 * Class TarefaController
 * @package Gamification\Http\Controllers
 */
class TarefaController extends Controller
{
    use RestControllerTrait, SlugableTrait;

    const MODEL = Tarefa::class;

    /**
     * Lista tarefas para a tabela
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function tableList()
    {
        $m = self::MODEL;
        $list = $m::orderBy('gamification_tarefas.titulo', 'ASC');
        $list = $this->handleRequest($list);

        return $this->listResponse($list);
    }

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
            $data = Input::all();
            $data['slug'] = $this->generateSlug('slug', Input::get('titulo'));

            $data = $m::create($data);
            return $this->createdResponse($data);
        } catch (\Exception $ex) {
            $data = ['exception' => $ex->getMessage()];

            \Log::error(logMessage($ex, 'Erro ao salvar recurso'), ['model' => self::MODEL]);
            return $this->clientErrorResponse($data);
        }
    }

    /**
     * Atualiza um recurso
     *
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function update($id)
    {
        $m = self::MODEL;

        if (!$data = $m::find($id)) {
            return $this->notFoundResponse();
        }

        try {
            $data->fill(Input::all());
            if ($data->getOriginal('titulo') !== $data->titulo) {
                $data->slug = $this->generateSlug('slug', $data->titulo);
            }

            $data->save();
            return $this->showResponse($data);
        } catch (\Exception $ex) {
            \Log::error(logMessage($ex, 'Erro ao atualizar recurso'), ['model' => self::MODEL]);

            $data = ['exception' => $ex->getMessage()];
            return $this->clientErrorResponse($data);
        }
    }
}
