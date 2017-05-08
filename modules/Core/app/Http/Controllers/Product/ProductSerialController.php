<?php namespace Core\Http\Controllers\Product;

use Core\Models\ProductSerial;
use App\Http\Controllers\Controller;

class ProductSerialController extends Controller
{
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
}
