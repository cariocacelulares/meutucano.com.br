<?php namespace Core\Http\Controllers\Supplier;

use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Rest\RestControllerTrait;
use App\Http\Controllers\Controller;
use Core\Models\Supplier;
use Core\Transformers\SupplierTransformer;

/**
 * Class SupplierController
 * @package Core\Http\Controllers\Supplier
 */
class SupplierController extends Controller
{
    use RestControllerTrait;

    const MODEL = Supplier::class;

    /**
     * Lista para a tabela
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function tableList()
    {
        $list = (self::MODEL)::orderBy('created_at', 'DESC');

        $list = $this->handleRequest($list);

        return $this->listResponse(SupplierTransformer::tableList($list));
    }

    /**
     * Search suppliers by cnpj
     *
     * @param  string $term
     * @return Object
     */
    public function search($term)
    {
        try {
            $supplier = (self::MODEL)
                ::where('cnpj', 'LIKE', "%{$term}%")
                ->orderBy('created_at', 'DESC')
                ->first();

            return $this->showResponse($supplier);
        } catch (\Exception $exception) {
            return $this->showResponse(null);
        }
    }
}
