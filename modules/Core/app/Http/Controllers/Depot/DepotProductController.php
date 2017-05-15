<?php namespace Core\Http\Controllers\Depot;

use Core\Models\Depot;
use Core\Models\Pedido;
use Core\Models\Product;
use Core\Models\DepotProduct;
use Core\Models\ProductSerial;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Input;
use Core\Models\DepotWithdrawProduct;

class DepotProductController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:product_depot_list', ['only' => [
            'index',
            'listByProduct',
            'listByDepot'
        ]]);
        $this->middleware('permission:product_depot_show', ['only' => ['show']]);
        $this->middleware('permission:product_depot_create', ['only' => ['store']]);
        $this->middleware('permission:product_depot_update', ['only' => ['update']]);
        $this->middleware('permission:product_depot_delete', ['only' => ['destroy']]);
    }

    /**
     * Returns a list of DepotProduct filtered by sku
     *
     * @param  int $sku
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function listByProduct($sku, $slug = null)
    {
        try {
            $depotProducts = DepotProduct::with(['depot'])
                ->where('product_sku', $sku);

            if ($slug) {
                $depotProducts = $depotProducts->where('depot_slug', $slug);
            }

            $depotProducts = $depotProducts->orderBy('quantity', 'DESC')->get();

            return listResponse($depotProducts);
        } catch (\Exception $exception) {
            return clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * Returns a list of DepotProduct filtered by slug
     *
     * @param  int $slug
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function listByDepot($slug)
    {
        try {
            $depotProducts = DepotProduct::with(['product'])
                ->where('depot_slug', '=', $slug)
                ->orderBy('quantity', 'DESC');

            return tableListResponse($depotProducts);
        } catch (\Exception $exception) {
            return clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function store(Request $request)
    {
        try {
            $data = DepotProduct::create($request->all());

            return createdResponse($data);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao salvar recurso'));

            return clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function destroy($id)
    {
        try {
            $data = DepotProduct::findOrFail($id);
            $data->delete();

            return deletedResponse();
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao excluir recurso'));

            return clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }
}
