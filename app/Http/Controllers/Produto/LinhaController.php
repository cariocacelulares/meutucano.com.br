<?php namespace App\Http\Controllers\Produto;

use App\Http\Controllers\RestControllerTrait;
use App\Http\Controllers\Controller;
use App\Models\Produto\Linha;
use App\Models\Produto\Atributo;
use App\Models\Produto\Opcao;
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

    protected $validationRules = [];

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
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function show($id)
    {
        $m = self::MODEL;
        $data = $m::with('atributos')->find($id);

        if ($data) {
            return $this->showResponse($data);
        }

        return $this->notFoundResponse();
    }

    /**
     * Remove attributes attached to line and his options
     *
     * @param  int $linha_id     id da linha
     * @param  array $attributes post array
     * @return void
     */
    function removeAttributes($linha_id, $toRemove) {
        try {
            if ($toRemove) {
                if ($toRemove['opcoes']) {
                    foreach ($toRemove['opcoes'] as $opcao_id) {
                        $opcao = Opcao::find($opcao_id);

                        if ($opcao)
                            $opcao->delete();
                    }
                }

                if ($toRemove['atributos']) {
                    if ($toRemove['atributos']) {
                        foreach ($toRemove['atributos'] as $attr_id) {
                            $attr = Atributo::find($attr_id);

                            if ($attr) {
                                $attr->opcoes()->delete();
                                $attr->delete();
                            }
                        }
                    }
                }
            }
        } catch (\Exception $ex) {
            $data = ['exception' => $ex->getMessage()];
            return $this->clientErrorResponse($data);
        }

        return true;
    }

    /**
     * Insert attributes attached to line and his options
     *
     * @param  Object $m          Linha object
     * @param  array $attributes  post array
     * @return void
     */
    function attachAttributes($m, $attributes) {
        try {
            if ($attributes) {
                // Percorre todos os atributos e organiza em arrays diferentes
                $toAdd  = ['simples' => [], 'opcoes' => []];
                $toEdit = [];
                foreach ($attributes as $attr) {
                    if (!isset($attr['titulo']) || !trim($attr['titulo']))
                        continue;

                    $attr['linha_id'] = $m->id;
                    $tipo = ($attr['tipo'] == 1) ? 'opcoes' : 'simples';
                    unset($attr['tipo']);

                    // já existe
                    if (isset($attr['id'])) {
                        $toEdit[] = $attr;
                    } else {
                        $toAdd[$tipo][] = $attr;
                    }
                }

                // Insere os atributos novos sem opcoes
                $m->atributos()->insert($toAdd['simples']);

                // Percorre os atributos novos COM opcoes
                foreach ($toAdd['opcoes'] as $attr) {
                    $newAttr = new Atributo($attr);
                    $newAttr->save();

                    $opcoes = [];
                    foreach ($attr['opcoes'] as $opcao) {
                        if ($opcao['valor']) {
                            $opcao['atributo_id'] = $newAttr->id;
                            $opcoes[] = $opcao;
                        }
                    }

                    // Salva todas as opcoes em um unico insert
                    if ($opcoes) {
                        $newAttr->opcoes()->insert($opcoes);
                    }
                }

                // Percorre os atributos antigos
                foreach ($toEdit as $attr) {
                    $editAttr = Atributo::find($attr['id']);

                    if ($editAttr) {
                        if (!$attr['opcoes'])
                            $attr['opcoes'] = null;

                        $editAttr->fill($attr);
                        $editAttr->save();

                        if ($attr['opcoes']) {
                            $opcoes = [];
                            foreach ($attr['opcoes'] as $opcao) {
                                $opcao['atributo_id'] = $editAttr->id;

                                if (isset($opcao['id'])) {
                                    $editOpcao = Opcao::find($opcao['id']);
                                    if ($editOpcao) {
                                        $editOpcao->fill($opcao);
                                        $editOpcao->save();
                                    }
                                } else {
                                    $opcoes[] = $opcao;
                                }
                            }

                            // Salva todas as opcoes em um unico insert
                            $editAttr->opcoes()->insert($opcoes);
                        }
                    }
                }
            }
        } catch (\Exception $ex) {
            $data = ['exception' => $ex->getMessage()];
            return $this->clientErrorResponse($data);
        }

        return true;
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
            $this->removeAttributes($data->id, Input::get('removidos'));
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
            $this->removeAttributes($data->id, Input::get('removidos'));
            $this->attachAttributes($data, Input::get('atributos'));

            return $this->createdResponse($data);
        } catch(\Exception $ex) {
            $data = ['form_validations' => $v->errors(), 'exception' => $ex->getMessage()];

            \Log::error(logMessage($ex, 'Erro ao salvar recurso'));
            return $this->clientErrorResponse($data);
        }
    }
}