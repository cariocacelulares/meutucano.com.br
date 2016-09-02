<?php namespace App\Http\Controllers\Produto;

use App\Http\Controllers\RestControllerTrait;
use App\Http\Controllers\Controller;
use App\Models\Produto\Linha;
use App\Models\Produto\Atributo;
use Illuminate\Support\Facades\Input;
use Illuminate\Http\Request;

/**
 * Class LinhaController
 * @package App\Http\Controllers\Produto
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
            // Separa os atributos com opcoes dos sem
            // para fazer o minimo de queries

            $attrSimples = [];
            $attrOpcoes  = [];
            foreach ($attributes as $attr) {
                if (isset($attr['tipo']))
                    unset($attr['tipo']);

                if (isset($attr['opcoes'])) {
                    if (isset($attr['id'])) {
                        // Exclui as opções
                        Atributo::find($attr['id'])->opcoes()->delete();
                        unset($attr['id']);
                    }
                    $attrOpcoes[] = $attr;
                } else {
                    if (isset($attr['id']))
                        unset($attr['id']);
                    $attrSimples[] = $attr;
                }
            }

            // Exclui os atributos
            $m->atributos()->delete();

            $attrs = [];
            foreach ($attrSimples as $attr) {
                if (!isset($attr['titulo']) || !trim($attr['titulo']))
                    continue;

                // Insere o id da linha pois o insert() não adiciona automaticamente
                $attrs[] = array_merge($attr, ['linha_id' => $m->id]);
            }

            $m->atributos()->insert($attrs);

            $attrs = [];
            foreach ($attrOpcoes as $attr) {
                if (!isset($attr['titulo']) || !trim($attr['titulo']))
                    continue;

                $attr['linha_id'] = $m->id;

                $newAttr = new Atributo($attr);
                $newAttr->save();

                $opcoes = [];
                foreach ($attr['opcoes'] as $key => $opcao) {
                    if (isset($opcao['text'])) {
                        $opcoes[$key]['valor'] = $opcao['text'];
                        $opcoes[$key]['atributo_id'] = $newAttr->id;
                    }
                }

                $newAttr->opcoes()->insert($opcoes);
            }
        }

        return $m::with('atributos');
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