<?php namespace Core\Http\Controllers\Stock;

use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use Core\Models\Stock;
use Core\Http\Requests\Stock\StockRequest as Request;

/**
 * Class StockController
 * @package Core\Http\Controllers\Stock
 */
class StockController extends Controller
{
    use RestControllerTrait;

    const MODEL = Stock::class;

    public function __construct()
    {
        $this->middleware('permission:depot_list', ['only' => ['index']]);
        $this->middleware('permission:depot_show', ['only' => ['show']]);
        $this->middleware('permission:depot_create', ['only' => ['store']]);
        $this->middleware('permission:depot_update', ['only' => ['update']]);
        $this->middleware('permission:depot_delete', ['only' => ['destroy']]);
    }

    /**
     * Lista para a tabela
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function tableList()
    {
        $this->middleware('permission:depot_list');

        $list = Stock::orderBy('priority', 'ASC');
        $list = $this->handleRequest($list);

        return $this->listResponse($list);
    }

    /**
     * Cria novo recurso
     *
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function store(Request $request)
    {
        try {
            $input = Input::all();
            $input['slug'] = str_slug($input['title']);

            $data = Stock::create($input);

            return $this->createdResponse($data);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao salvar recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }
}
