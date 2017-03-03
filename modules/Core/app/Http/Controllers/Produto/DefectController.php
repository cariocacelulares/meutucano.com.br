<?php namespace Core\Http\Controllers\Produto;

use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use Core\Http\Requests\DefectRequest as Request;

/**
 * Class DefectController
 * @package Core\Http\Controllers\Produto
 */
class DefectController extends Controller
{
    use RestControllerTrait;

    const MODEL = ProductImei::class;

    /**
     * Create a new resource
     *
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function store(Request $request)
    {
        try {
            $data = (self::MODEL)::create(Input::all());

            return $this->createdResponse($data);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao salvar recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse([
                'exception' => $exception->getMessage()
            ]);
        }
    }
}
