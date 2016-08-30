<?php namespace App\Http\Controllers\Linha;

use Carbon\Carbon;
use App\Http\Controllers\RestControllerTrait;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Models\Linha;
use App\Models\LinhaAtributo;
use Illuminate\Support\Facades\Input;
use Illuminate\Http\Request;

/**
 * Class LinhaController
 * @package App\Http\Controllers\Linha
 */
class LinhaController extends Controller
{
    use RestControllerTrait;

    const MODEL = Linha::class;

    protected $validationRules = [
        'titulo' => 'required|min:10|max:255',
    ];

    /**
     * Lista linhas para a tabela
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function tableList() {
        $m = self::MODEL;

        $list = $m::orderBy('linhas.created_at', 'DESC');

        $list = $this->handleRequest($list);

        return $this->listResponse($list);
    }

    /**
     * Insert attributes attached to line in a single sql insert
     *
     * @param  Object $m          Linha object
     * @param  array $attributes  post array
     * @return boolean            success
     */
    function attachAttributes($m, $attributes) {
        if ($attributes) {
            $m->atributos()->delete();

            // Insere o id da linha pois o insert() não adiciona automaticamente
            $attrs = [];
            foreach ($attributes as $attr) {
                if (isset($attr['opcoes'])) {
                    $opcoes = [];
                    foreach ($attr['opcoes'] as $opcao) {
                        if (isset($opcao['text'])) {
                            $opcoes[] = $opcao['text'];
                        }
                    }
                    $attr['opcoes'] = implode(';', $opcoes);
                } else {
                    $attr['opcoes'] = null;
                }

                if (isset($attr['id'])) {
                    unset($attr['id']);
                }

                $attrs[] = array_merge($attr, ['linha_id' => $m->id]);
            }

            return $m->atributos()->insert($attrs);
        }

        return null;
    }

    /**
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

            $data->fill(Input::except(['atributos']));
            $data->save();
            $this->attachAttributes($data, Input::get('atributos'));

            return $this->showResponse($data);
        } catch (\Exception $ex) {
            $data = ['form_validations' => $v->errors(), 'exception' => $ex->getMessage()];
            return $this->clientErrorResponse($data);
        }
    }

    /**
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

            $data = $m::create(Input::all());
            $this->attachAttributes($data, Input::get('atributos'));

            return $this->createdResponse($data);
        } catch(\Exception $ex) {
            $data = ['form_validations' => $v->errors(), 'exception' => $ex->getMessage()];

            \Log::error(logMessage($ex, 'Erro ao salvar recurso'));
            return $this->clientErrorResponse($data);
        }
    }
}