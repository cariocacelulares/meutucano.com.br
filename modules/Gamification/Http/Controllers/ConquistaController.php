<?php namespace Modules\Gamification\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Rest\RestControllerTrait;
use Modules\Gamification\Http\Controllers\Traits\SlugableTrait;
use Modules\Gamification\Models\Conquista;

/**
 * Class ConquistaController
 * @package Modules\Gamification\Http\Controllers
 */
class ConquistaController extends Controller
{
    use RestControllerTrait, SlugableTrait;

    const MODEL = Conquista::class;

    protected $validationRules = [];

    /**
     * Lista conquistas para a tabela
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function tableList() {
        $m = self::MODEL;
        $list = $m::orderBy('gamification_conquistas.titulo', 'ASC');
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

            if($v->fails()) {
                throw new \Exception('ValidationException');
            }

            $data = Input::all();
            $data['slug'] = $this->generateSlug('slug', Input::get('titulo'));

            $data = $m::create($data);
            return $this->createdResponse($data);
        } catch(\Exception $ex) {
            $data = ['form_validations' => $v->errors(), 'exception' => $ex->getMessage()];

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
            $v = \Validator::make(Input::all(), $this->validationRules);

            if ($v->fails()) {
                throw new \Exception("ValidationException");
            }

            $data->fill(Input::all());
            if ($data->getOriginal('titulo') !== $data->titulo) {
                $data->slug = $this->generateSlug('slug', $data->titulo);
            }

            $data->save();
            return $this->showResponse($data);
        } catch(\Exception $ex) {
            \Log::error(logMessage($ex, 'Erro ao atualizar recurso'), ['model' => self::MODEL]);

            $data = ['form_validations' => $v->errors(), 'exception' => $ex->getMessage()];
            return $this->clientErrorResponse($data);
        }
    }
}
