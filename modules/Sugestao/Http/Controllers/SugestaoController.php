<?php namespace Modules\Sugestao\Http\Controllers;

use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Rest\RestControllerTrait;
use Modules\Sugestao\Models\Sugestao;

/**
 * Class SugestaoController
 * @package Modules\Sugestao\Http\Controllers
 */
class SugestaoController extends Controller
{
    use RestControllerTrait;

    const MODEL = Sugestao::class;

    protected $validationRules = [];

    /**
     * Lista marcas para a tabela
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function tableList()
    {
        $m = self::MODEL;

        $list = $m::with('usuario')->orderBy('sugestoes.created_at', 'DESC');

        foreach (json_decode(Input::get('filter')) as $filter) {
            if ($filter->column == 'sugestoes.usuario_id') {
                $list = $list->where('anonimo', '=', false);
                break;
            }
        }

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
            $v = \Validator::make(Input::all(), $this->validationRules);

            if ($v->fails()) {
                throw new \Exception('ValidationException');
            }

            $data = $m::create(array_merge(Input::all(), ['usuario_id' => getCurrentUserId()]));

            return $this->createdResponse($data);
        } catch(\Exception $exception) {
            $data = ['form_validations' => $v->errors(), 'exception' => $exception->getMessage()];

            \Log::error(logMessage($exception, 'Erro ao salvar recurso'), ['model' => self::MODEL]);
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
            $v = \Validator::make(Input::all(), $this->validationRules);

            if ($v->fails()) {
                throw new \Exception("ValidationException");
            }

            if (Input::get('status') == 1) {
                \Event::fire(new \App\Events\Gamification\TarefaRealizada('tenha-uma-sugestaocritica-aceita'));
            }

            $data->fill(Input::all());
            $data->save();

            return $this->showResponse($data);
        } catch(\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao atualizar recurso'), ['model' => self::MODEL]);

            $data = ['form_validations' => $v->errors(), 'exception' => $exception->getMessage()];
            return $this->clientErrorResponse($data);
        }
    }
}
