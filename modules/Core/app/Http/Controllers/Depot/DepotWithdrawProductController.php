<?php namespace Core\Http\Controllers\Depot;

use Core\Models\ProductSerial;
use Core\Models\DepotWithdraw;
use App\Http\Controllers\Controller;
use Core\Models\DepotWithdrawProduct;
use Core\Http\Requests\Depot\DepotWithdrawProductRequest as Request;

class DepotWithdrawProductController extends Controller
{
    /**
     * Check if serial can be confirmed or returned
     *
     * @param  array $serials
     * @param  int   $depotWithdrawId
     * @return boolean|string
     */
    public function checkSerialsConfirmOrReturn($serials, $depotWithdrawId, $checkStatus = DepotWithdrawProduct::STATUS_WITHDRAWN)
    {
        try {
            $depotWithdraw = DepotWithdraw::with([
                'products',
                'products.productSerial'
            ])->findOrFail($depotWithdrawId);

            if ($depotWithdraw->closed_at)
                throw new \Exception("Não é possível confirmar/retornar produtos de uma retirada fechada.");

            $checkSerials = collect($serials)
                ->diff($depotWithdraw->products->pluck('productSerial.serial'));

            if ($checkSerials->count())
                throw new \Exception("Produto não pertence à retirada.");

            $depotWithdrawProducts = $depotWithdraw->products()->whereHas('productSerial', function($query) use ($serials) {
                $query->whereIn('serial', $serials);
            });

            if ($depotWithdrawProducts->pluck('status')->diff($checkStatus)->count())
                throw new \Exception("Produto não elegível para essa ação, cheque seu status para prosseguir.");

            return true;
        } catch (\Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * Check if serial can be confirmed
     *
     * @param  string $serial
     * @param  int $depotWithdrawId
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function checkConfirm(Request $request)
    {
        try {
            $data = self::checkSerialsConfirmOrReturn(
                $request->input('serials'),
                $request->input('depot_withdraw_id')
            );

            if ($data !== true)
                return validationFailResponse([
                    'available' => false,
                    'message'   => $data
                ]);

            return showResponse([
                'available' => true
            ]);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao realizar conferência'));

            return clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * Check if serial can be returned
     *
     * @param  string $serial
     * @param  int $depotWithdrawId
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function checkReturn(Request $request)
    {
        try {
            $data = self::checkSerialsConfirmOrReturn(
                $request->input('serials'),
                $request->input('depot_withdraw_id'),
                DepotWithdrawProduct::STATUS_CONFIRMED
            );

            if ($data !== true)
                return validationFailResponse([
                    'available' => false,
                    'message'   => $data
                ]);

            return showResponse([
                'available' => true
            ]);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao realizar conferência'));

            return clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * Verify and confirm serials
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function confirm(Request $request)
    {
        try {
            $data = self::checkSerialsConfirmOrReturn(
                $request->input('serials'),
                $request->input('depot_withdraw_id')
            );

            if ($data !== true)
                return validationFailResponse([
                    'available' => false,
                    'message'   => $data
                ]);

            $depotWithdraw = DepotWithdraw::findOrFail($request->input('depot_withdraw_id'));

            $depotWithdrawProducts = $depotWithdraw->products()->whereHas('productSerial', function($query) use ($request) {
                $query->whereIn('serial', $request->input('serials'));
            });

            $depotWithdrawProducts->update(['status' => DepotWithdrawProduct::STATUS_CONFIRMED]);

            return showResponse($depotWithdraw);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao fechar recurso'));

            return clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * Verify and return serials
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function return(Request $request)
    {
        try {
            $data = self::checkSerialsConfirmOrReturn(
                $request->input('serials'),
                $request->input('depot_withdraw_id'),
                DepotWithdrawProduct::STATUS_CONFIRMED
            );

            if ($data !== true)
                return validationFailResponse([
                    'available' => false,
                    'message'   => $data
                ]);

            $depotWithdraw = DepotWithdraw::findOrFail($request->input('depot_withdraw_id'));

            $depotWithdrawProducts = $depotWithdraw->products()->whereHas('productSerial', function($query) use ($request) {
                $query->whereIn('serial', $request->input('serials'));
            });

            $depotWithdrawProducts->update(['status' => DepotWithdrawProduct::STATUS_RETURNED]);

            return showResponse($depotWithdraw);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao fechar recurso'));

            return clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }
}
