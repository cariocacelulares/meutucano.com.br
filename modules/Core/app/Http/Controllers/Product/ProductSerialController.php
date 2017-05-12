<?php namespace Core\Http\Controllers\Product;

use Core\Models\ProductSerial;
use Core\Models\DepotWithdrawProduct;
use App\Http\Controllers\Controller;
use Core\Http\Requests\ProductSerialTransferRequest as TransferRequest;
use Core\Http\Requests\ProductSerialCheckTransferRequest as CheckTransferRequest;

class ProductSerialController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:depot_transfer', ['only' => ['transfer']]);
    }

    /**
     * @param $serial
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function find($serial)
    {
        try {
            $data = ProductSerial::where('serial', $serial)->firstOrFail();
            $data->setAppends(['in_stock']);

            return showResponse($data);
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao obter recurso'));

            return clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * @param  string|array $serials
     * @param  string $depotFrom
     * @param  int $productSku
     * @return boolean
     */
    private function checkSerialsTransferable($serials, $depotSlug, $productSku = null)
    {
        try {
            $checkSerials = ProductSerial::with([
                'depotProduct',
                'withdrawProducts',
                'orderProducts',
                'orderProducts.order'
            ])->whereIn('serial', $serials)->get();

            $checkSerials->map(function($serial) {
                $verifyWithdraw = $serial->withdrawProducts->pluck('status')->search(function($status) {
                    return in_array($status, [
                        DepotWithdrawProduct::STATUS_WITHDRAWN,
                        DepotWithdrawProduct::STATUS_CONFIRMED
                    ]);
                });

                if ($verifyWithdraw !== false)
                    throw new \Exception("Serial pertence a uma retirada de estoque em aberto.");

                $serial->append('in_stock');
            });

            if ($checkSerials->count() != sizeof($serials))
                throw new \Exception("Serial inexistente.");

            if ($checkSerials->pluck('depotProduct.depot_slug')->diff($depotSlug)->count())
                throw new \Exception("Serial não pertence ao estoque informado.");

            if ($productSku && $checkSerials->pluck('depotProduct.product_sku')->diff($productSku)->count())
                throw new \Exception("Serial não pertence ao produto informado.");

            if ($checkSerials->pluck('in_stock')->diff(true)->count())
                throw new \Exception("Serial não consta em estoque.");

            return true;
        } catch (\Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * Check if serials are transferable from depot
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function checkTransfer(CheckTransferRequest $request)
    {
        try {
            $data = $this->checkSerialsTransferable(
                $request->input('serials'),
                $request->input('depot_from'),
                $request->input('product_sku')
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
            \Log::error(logMessage($exception, 'Erro ao realizar conferência '));

            return clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }

    /**
     * Transfer serials to another depot
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function transfer(TransferRequest $request)
    {
        try {
            $data = $this->checkSerialsTransferable(
                $request->input('serials'),
                $request->input('depot_from'),
                $request->input('product_sku')
            );

            if ($data !== true)
                return validationFailResponse([
                    'available' => false,
                    'message'   => $data
                ]);

            // Realiza transferência
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Erro ao realizar conferência '));

            return clientErrorResponse([
                'exception' => '[' . $exception->getLine() . '] ' . $exception->getMessage()
            ]);
        }
    }
}
