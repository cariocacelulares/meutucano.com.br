<?php namespace Core\Http\Controllers\Supplier;

use Core\Models\Supplier;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Input;
use Core\Transformers\SupplierTransformer;
use App\Http\Controllers\Rest\RestControllerTrait;

/**
 * Class SupplierController
 * @package Core\Http\Controllers\Supplier
 */
class SupplierController extends Controller
{
    use RestControllerTrait;

    const MODEL = Supplier::class;

    public function __construct()
    {
        $this->middleware('permission:supplier_list', ['only' => ['index']]);
        $this->middleware('permission:supplier_show', ['only' => ['show']]);
        $this->middleware('permission:supplier_create', ['only' => ['store']]);
        $this->middleware('permission:supplier_update', ['only' => ['update']]);
        $this->middleware('permission:supplier_delete', ['only' => ['destroy']]);
    }

    /**
     * Lista para a tabela
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function tableList()
    {
        $this->middleware('permission:supplier_list');

        $list = Supplier::orderBy('created_at', 'DESC');
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
        $this->middleware('permission:supplier_list');

        try {
            $supplier = Supplier::where('cnpj', 'LIKE', "%{$term}%")
                ->orderBy('created_at', 'DESC')
                ->first();

            return $this->showResponse($supplier);
        } catch (\Exception $exception) {
            return $this->showResponse(null);
        }
    }
}
