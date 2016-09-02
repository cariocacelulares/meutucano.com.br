<?php namespace App\Http\Controllers\Produto;

use App\Http\Controllers\RestControllerTrait;
use App\Http\Controllers\Controller;
use App\Models\Produto\Produto;
use Illuminate\Support\Facades\Input;

/**
 * Class ProdutoController
 * @package App\Http\Controllers\Produto
 */
class ProdutoController extends Controller
{
    use RestControllerTrait;

    const MODEL = Produto::class;

    protected $validationRules = [];

    /**
     * Lista produtos para a tabela
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function tableList() {
        $m = self::MODEL;

        $list = $m
            ::with('linha')
            ->with('marca')
            ->where('ativo', true)
            ->orderBy('produtos.created_at', 'DESC');

        $list = $this->handleRequest($list);

        return $this->listResponse($list);
    }

    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function store()
    {
        echo 'save';
        throw new \Exception("Error Processing Request", 1);

        $m = self::MODEL;
        try {
            $v = \Validator::make(Input::all(), $this->validationRules);

            if($v->fails()) {
                throw new \Exception("ValidationException");
            }
            $data = $m::create(Input::all());
            return $this->createdResponse($data);
        } catch(\Exception $ex) {
            $data = ['form_validations' => $v->errors(), 'exception' => $ex->getMessage()];

            \Log::error(logMessage($ex));
            return $this->clientErrorResponse($data);
        }
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

            $attrs = Input::get('atributos');
            if ($attrs) {
                $data->atributos()->detach();

                $atributos = [];
                foreach ($attrs as $attr) {
                    $atributos[] = [
                        'produto_id' => $attr['pivot']['produto_id'],
                        'atributo_id' => $attr['pivot']['atributo_id'],
                        'opcao_id' => $attr['pivot']['opcao_id']['id'],
                        'valor' => $attr['pivot']['valor']
                    ];
                }
                $data->atributos()->attach($atributos);
            }

            return $this->showResponse($data);
        } catch(\Exception $ex) {
            $data = ['form_validations' => $v->errors(), 'exception' => $ex->getMessage()];
            return $this->clientErrorResponse($data);
        }
    }
}