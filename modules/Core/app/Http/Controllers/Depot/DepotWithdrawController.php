<?php namespace Core\Http\Controllers\Depot;

use Carbon\Carbon;
use Core\Models\OrderProduct;
use Core\Models\DepotWithdraw;
use Core\Models\ProductSerial;
use App\Http\Controllers\Controller;
use Core\Models\DepotWithdrawProduct;
use Core\Http\Controllers\Product\ProductSerialController;
use Core\Http\Requests\Depot\DepotWithdrawRequest as Request;
use Core\Http\Requests\Depot\DepotWithdrawUpdateRequest as UpdateRequest;

class DepotWithdrawController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:withdraw_list', ['only' => ['index']]);
        $this->middleware('permission:withdraw_show', ['only' => ['show']]);
        $this->middleware('permission:withdraw_create', ['only' => ['store']]);
        $this->middleware('permission:withdraw_update', ['only' => ['update']]);
        $this->middleware('permission:withdraw_delete', ['only' => ['destroy']]);
        $this->middleware('permission:withdraw_close', ['only' => ['close']]);

        $this->middleware('convertJson', ['only' => 'index']);
    }

    /**
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function index()
    {
        $search = request('search');

        $data = DepotWithdraw::with(['user', 'depot'])
            ->join('users', 'users.id', '=', 'depot_withdraws.user_id')
            ->leftJoin('depots', 'depots.slug', '=', 'depot_withdraws.depot_slug')
            ->where(function($query) use ($search) {
                $query->where('depot_withdraws.id', 'LIKE', "%{$search}%")
                    ->orWhere('users.name', 'LIKE', "%{$search}%")
                    ->orWhere('depots.title', 'LIKE', "%{$search}%");
            })
            ->where(function($query) {
                $query->whereMonth('depot_withdraws.created_at', request('filter.month'))
                    ->whereYear('depot_withdraws.created_at', request('filter.year'));
            })
            ->select('depot_withdraws.*')
            ->orderBy('created_at', 'DESC')
            ->paginate(
                request('per_page', 10)
            );

        return listResponse($data);
    }

    /**
     * @param $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function show($id)
    {
        try {
            $data = DepotWithdraw::with([
                'depot',
                'products',
                'products.productSerial',
                'products.depotProduct',
                'products.depotProduct.product',
            ])->findOrFail($id);

            return showResponse($data);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao obter recurso'));

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
            $check = ProductSerialController::checkSerials(
                $request->input('serials'),
                $request->input('depot_slug')
            );

            if ($check !== true)
                return validationFailResponse([
                    'available' => false,
                    'message'   => $check
                ]);

            \DB::transaction(function() use ($request, &$withdraw) {
                $withdraw = DepotWithdraw::create($request->except('serials'));

                $checkSerials = ProductSerial::with('depotProduct')
                    ->whereIn('serial', $request->input('serials'))
                    ->get();

                foreach ($checkSerials as $serial) {
                    $withdrawProducts[] = new DepotWithdrawProduct([
                        'depot_product_id'  => $serial->depotProduct->id,
                        'product_serial_id' => $serial->id
                    ]);
                }

                $withdraw->products()->saveMany($withdrawProducts);
            });

            return createdResponse($withdraw);
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
    public function update(UpdateRequest $request, $id)
    {
        try {
            $withdraw = DepotWithdraw::with([
                'products',
                'products.productSerial'
            ])->findOrFail($id);

            if ($withdraw->user_id != $request->input('user_id')) {
                if ($this->checkNonConfirmed($withdraw->id) === false) {
                    throw new \Exception("Não é possível alterar o usuário da retirada pois existem produtos com retirada confirmada.");
                }
            }

            $deletedSerials = $withdraw->products->pluck('productSerial.serial')
                ->diff($request->serials)
                ->toArray();

            if ($this->checkNonConfirmed($withdraw->id, $deletedSerials) === false) {
                throw new \Exception("Não é possível deletar um produto da retirada que não esteja no status pendente.");
            }

            $newSerials = collect($request->serials)
                ->diff($withdraw->products->pluck('productSerial.serial'))
                ->toArray();

            $check = ProductSerialController::checkSerials(
                $newSerials,
                $withdraw->depot_slug
            );

            if ($check !== true)
                return validationFailResponse([
                    'available' => false,
                    'message'   => $check
                ]);

            \DB::transaction(function() use ($request, &$withdraw) {
                $withdraw->user_id = $request->input('user_id');
                $withdraw->save();

                $withdraw->products()->delete();

                $checkSerials = ProductSerial::with('depotProduct')
                    ->whereIn('serial', $request->input('serials'))
                    ->get();

                foreach ($checkSerials as $serial) {
                    $withdrawProducts[] = new DepotWithdrawProduct([
                        'depot_product_id'  => $serial->depotProduct->id,
                        'product_serial_id' => $serial->id
                    ]);
                }

                $withdraw->products()->saveMany($withdrawProducts);
            });

            return showResponse($withdraw);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao atualizar recurso'));

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

            if ($this->checkNonConfirmed($data->id, $deletedSerials) === false) {
                throw new \Exception("Não é possível deletar uma retirada que tenha produtos confirmados.");
            }

            $data->delete();

            return deletedResponse();
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao excluir recurso'));

            return clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * Check if serials are still pending in the withdraw
     *
     * @param  int   $withdrawId
     * @param  array $serials
     * @return boolean
     */
    private function checkNonConfirmed($withdrawId, $serials = null)
    {
        $checkSerials = DepotWithdrawProduct::where('depot_withdraw_id', $withdrawId)
            ->where('status', '!=', DepotWithdrawProduct::STATUS_WITHDRAWN);

        if ($serials) {
            $checkSerials = $checkSerials->with([
                'productSerial' => function($query) use ($serials) {
                    $query->whereIn('serial', $serials);
                }
            ]);
        }

        if ($checkSerials->count())
            return false;

        return true;
    }

    /**
     * Verify and closes a depot withdraw
     *
     * @param  int $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function close($id)
    {
        try {
            $depotWithdraw = DepotWithdraw::findOrFail($id);

            $checkSerials = $depotWithdraw->products()
                ->whereIn('status', [
                    DepotWithdrawProduct::STATUS_WITHDRAWN,
                    DepotWithdrawProduct::STATUS_CONFIRMED
                ]);

            if ($checkSerials->count()) {
                throw new \Exception('Não é possível fechar uma retirada com produtos pendentes ou confirmados.');
            }

            $depotWithdraw->closed_at = Carbon::now();
            $depotWithdraw->save();

            return showResponse($depotWithdraw);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao fechar recurso'));

            return clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }
}
