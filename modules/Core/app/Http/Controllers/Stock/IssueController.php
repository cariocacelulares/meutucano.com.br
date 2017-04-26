<?php namespace Core\Http\Controllers\Stock;

use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use Core\Models\Produto\ProductImei;
use Core\Models\Stock\Issue;
use Core\Http\Requests\Stock\IssueRequest as Request;
use Core\Transformers\StockIssueTransformer;

/**
 * Class IssueController
 * @package Core\Http\Controllers\Stock
 */
class IssueController extends Controller
{
    use RestControllerTrait;

    const MODEL = Issue::class;

    public function __construct()
    {
        $this->middleware('permission:stock_issue_list', ['only' => ['index']]);
        $this->middleware('permission:stock_issue_show', ['only' => ['show']]);
        $this->middleware('permission:stock_issue_create', ['only' => ['store']]);
        $this->middleware('permission:stock_issue_update', ['only' => ['update']]);
        $this->middleware('permission:stock_issue_delete', ['only' => ['destroy']]);
    }

    /**
     * Lista para a tabela
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function tableList()
    {
        $this->middleware('permission:stock_issue_list');

        $list = Issue::with([
            'user',
            'productImei',
            'productImei.productStock',
            'productImei.productStock.stock',
            'productImei.productStock.product',
        ])
        ->join('product_imeis', 'product_imeis.id', 'stock_issues.product_imei_id')
        ->orderBy('created_at', 'DESC');

        $list = $this->handleRequest($list);

        return $this->listResponse(StockIssueTransformer::tableList($list));
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
            $fields = Input::except('imei');

            if (!isset($fields['user_id'])) {
                $fields['user_id'] = getCurrentUserId() ?: null;
            }

            $imei = Input::get('imei');
            $productImei = ProductImei::where('imei', '=', $imei)->first();

            if ($productImei) {
                $lastOrderProduct = $productImei->lastOrderProduct();

                if ($lastOrderProduct && $lastOrderProduct->pedido->status != 5) {
                    return $this->validationFailResponse([
                        'O serial pertence a um pedido em aberto ou já enviado'
                    ]);
                } else {
                    $fields['product_imei_id'] = $productImei->id;
                }
            } else {
                return $this->validationFailResponse([
                    'Não foi possível encontrar o imei ' . $imei
                ]);
            }

            $removal = Issue::create($fields);

            return $this->createdResponse($removal);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao salvar recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }
}
