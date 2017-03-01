<?php namespace Core\Http\Controllers\Stock;

use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use Core\Models\Produto\ProductImei;
use Core\Models\Stock\Issue;
use Core\Http\Requests\Stock\IssueRequest as Request;

/**
 * Class IssueController
 * @package Core\Http\Controllers\Stock
 */
class IssueController extends Controller
{
    use RestControllerTrait;

    const MODEL = Issue::class;

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
                $fields['product_imei_id'] = $productImei->id;
                $productImei->delete();
            } else {
                #TODO: validar se está um pedido, etc
                return $this->validationFailResponse([
                    'Não foi possível encontrar o imei ' . $imei
                ]);
            }

            $removal = (self::MODEL)::create($fields);

            return $this->createdResponse($removal);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao salvar recurso'), ['model' => self::MODEL]);

            return $this->clientErrorResponse([
                'exception' => $exception->getMessage()
            ]);
        }
    }
}
