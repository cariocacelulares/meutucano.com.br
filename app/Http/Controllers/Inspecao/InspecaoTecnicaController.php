<?php namespace App\Http\Controllers\Inspecao;

use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use App\Models\Inspecao\InspecaoTecnica;
use Illuminate\Support\Facades\Input;

/**
 * Class InspecaoTecnicaController
 * @package App\Http\Controllers\Inspecao
 */
class InspecaoTecnicaController extends Controller
{
    use RestControllerTrait;

    const MODEL = InspecaoTecnica::class;

    protected $validationRules = [];

    /**
     * Lista marcas para a tabela
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function tableList() {
        $m = self::MODEL;

        $list = $m::orderBy('inspecao_tecnica.created_at', 'DESC');

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
                throw new \Exception("ValidationException");
            }

            $data = $m::create(array_merge(Input::all(), ['usuario_id' => getCurrentUserId()]));

            return $this->createdResponse($data);
        } catch(\Exception $ex) {
            $data = ['form_validations' => $v->errors(), 'exception' => $ex->getMessage()];

            \Log::error(logMessage($ex, 'Erro ao salvar recurso'), ['model' => self::MODEL]);
            return $this->clientErrorResponse($data);
        }
    }
}