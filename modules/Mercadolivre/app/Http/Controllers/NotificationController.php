<?php namespace Mercadolivre\Http\Controllers;

use Core\Models\Pedido;
use Core\Models\Produto;
use Core\Models\Cliente;
use Mercadolivre\Models\Ad;
use Rastreio\Models\Rastreio;
use Core\Models\Cliente\Endereco;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Mercadolivre\Http\Services\Api;
use Illuminate\Support\Facades\Input;
use Core\Models\Pedido\PedidoProduto;
use Rastreio\Http\Controllers\RastreioController;
use Mercadolivre\Http\Controllers\Traits\CheckExpiredToken;

class NotificationController extends Controller
{
    use CheckExpiredToken;

    /**
     * Receive notifications from Mercado Livre
     *
     * @return void
     */
    public function notification(Api $api)
    {
        Log::debug('Requisição de notificação do ML:' . json_encode(Input::all()));
        switch (Input::get('topic')) {
            case 'orders':
                return $this->order($api, Input::get('resource'));
            default: break;
        }
    }

    /**
     * Parse order notification
     *
     * @param  string $resource
     * @return void
     */
    private function order(Api $api, $resource)
    {
        try {
            $orderId     = substr($resource, strrpos($resource, '/') + 1);
            $importOrder = $api->getOrder($orderId);

            if (!$this->checkProducts($importOrder))
                throw new \Exception("Um ou mais produtos do pedido não estão cadastrados no Tucano");

            $order = Pedido::where('codigo_marketplace', '=', $importOrder->id)
                ->first();

            if (in_array('paid', $importOrder->tags)) {
                if (!$order) {
                    $order = $this->importOrder($api, $importOrder);
                }
            } elseif (in_array('not_paid', $importOrder->tags)) {
                if (!$order) {
                    $order = $this->importOrder($api, $importOrder);
                } else {
                    $order->status = 5;
                    $order->save();
                }
            }

            if ($order) {
                if ($shipmentId = $importOrder->shipping->id) {
                    $this->importShipment($api, $order, $shipmentId);
                }
            }

            return response('', 200);
        } catch (\Exception $exception) {
            Log::critical(logMessage($exception,
                'Não foi possível importar o pedido do Mercado Livre'
            ), [$resource]);

            reportError('Pedido ' . $importOrder->id . ' não importado: ' . $exception->getMessage() . ' - ' . $exception->getLine());

            return response('', 422);
        }
    }

    /**
     * Return order products
     * @param  Object $order
     * @return array
     */
    private function getOrderProducts($order)
    {
        $adIds = [];
        foreach ($order->order_items as $item) {
            $adIds[] = $item->item->id;
        }

        return $adIds;
    }

    /**
     * Check if order can be imported based on products
     *
     * @param  Object $order
     * @return boolean
     */
    private function checkProducts($order)
    {
        $adIds = $this->getOrderProducts($order);
        $count = Ad::whereIn('code', $adIds)->count();

        return ($count == sizeof($adIds));
    }


    /**
     * Return ideal shipping method
     *
     * @param  Object $shipping
     * @return string
     */
    private function parseShippingMethod($shipping)
    {
        switch ($shipping->shipping_method_id) {
            case 182:
                return 'SEDEX';
            case 100009:
                return 'PAC';
            default:
                return null;
        }
    }

    /**
     * Import order to database
     *
     * @param  Object $order
     * @return boolean
     */
    private function importOrder(Api $api, $order)
    {
        try {

            if ($order->shipping->status == 'to_be_agreed')
                throw new \Exception("O pedido não possui informações de envio.");

            // Customer
            $customer = Cliente::firstOrNew(['mercadolivre_id' => $order->buyer->id]);
            $customer->mercadolivre_id = $order->buyer->id;
            $customer->tipo            = (strlen($order->buyer->billing_info->doc_number) > 11) ? 1 : 0;
            $customer->taxvat          = $order->buyer->billing_info->doc_number;
            $customer->nome            = $order->buyer->first_name . ' ' . $order->buyer->last_name;
            $customer->fone            = $order->buyer->phone->number;

            if ($customer->save()) {
                Log::info("ML: Cliente {$customer->id} importado para o pedido {$order->id}");
            } else {
                Log::warning("ML: Não foi possivel importar o cliente para o pedido {$order->id}");
            }

            // Address
            $address = Endereco::firstOrNew([
                'cliente_id' => $customer->id,
                'cep'        => $order->shipping->receiver_address->zip_code
            ]);

            $address->rua         = $order->shipping->receiver_address->street_name;
            $address->numero      = $order->shipping->receiver_address->street_number;
            $address->bairro      = $order->shipping->receiver_address->neighborhood->name;
            $address->complemento = $order->shipping->receiver_address->comment;
            $address->cidade      = $order->shipping->receiver_address->city->name;
            $address->uf          = substr($order->shipping->receiver_address->state->id, -2);

            if ($address->save()) {
                Log::info("ML: Endereço {$address->id} importado para o pedido {$order->id}");
            } else {
                Log::warning("ML: Não foi possível importar o endereço para o pedido {$order->id}");
            }

            DB::beginTransaction();
            Log::debug('Transaction - begin');

            // Order
            $importOrder = Pedido::firstOrNew([
                'cliente_id'         => $customer->id,
                'codigo_marketplace' => $order->id
            ]);

            $importOrder->cliente_id          = $customer->id;
            $importOrder->cliente_endereco_id = $address->id;
            $importOrder->frete_valor         = $order->shipping->shipping_option->cost;
            $importOrder->frete_metodo        = $this->parseShippingMethod($order->shipping->shipping_option);
            $importOrder->pagamento_metodo    = 'mercadopago';
            $importOrder->codigo_marketplace  = $order->id;
            $importOrder->codigo_api          = $order->id;
            $importOrder->marketplace         = 'MERCADOLIVRE';
            $importOrder->operacao            = 6108;
            $importOrder->total               = $order->total_amount;
            $importOrder->created_at          = date('Y-m-d H:i:s', strtotime($order->date_created));
            $importOrder->estimated_delivery  = date('Y-m-d', strtotime(
                $order->shipping->shipping_option->estimated_delivery_limit->date
            ));
            $importOrder->status              = in_array('paid', $order->tags) ? '1' : '0';

            if ($importOrder->save()) {
                Log::info("ML: Pedido {$importOrder->id} importado");
            } else {
                Log::warning("ML: Não foi possível importar o pedido {$importOrder->id}");
            }

            $adIds = $this->getOrderProducts($order);
            $ads = Ad::with('product')->whereIn('code', $adIds)->get();

            // Order products
            foreach ($order->order_items as $item) {
                for ($i = 0; $i < $item->quantity; $i++) {
                    $orderProduct = new PedidoProduto([
                        'pedido_id'   => $importOrder->id,
                        'produto_sku' => $ads->where('code', '=', $item->item->id)
                            ->first()->product->sku,
                        'valor'       => $item->unit_price
                    ]);

                    if ($orderProduct->save()) {
                        Log::info("PedidoProduto {$orderProduct->id} importado no pedido {$order->id}");
                    } else {
                        Log::warning("Não foi possível importar o PedidoProduto {$orderProduct->id} para o pedido {$order->id}");
                    }
                }
            }

            DB::commit();
            Log::debug('ML: Transaction - commit');

            return $importOrder;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug('ML: Transaction - rollback');

            Log::critical(logMessage($e, 'ML: Pedido ' . $order->id . ' não importado'));
            reportError('Pedido ' . $order->id . ' não importado: ' . $e->getMessage() . ' - ' . $e->getLine());

            return false;
        }
    }

    /**
     * Import shipment to database
     *
     * @param  Object $shipment
     * @return boolean
     */
    private function importShipment(Api $api, $order, $shipmentId)
    {
        try {
            $shipment = $api->getShipment($shipmentId);

            $track = null;
            if ($shipment->tracking_number) {
                $track = Rastreio::firstOrNew([
                    'pedido_id' => $order->id,
                    'rastreio'  => $shipment->tracking_number
                ]);

                $track->data_envio = date('Y-m-d');
                $track->servico    = ($shipment->tracking_method == 'PAC')
                    ? $shipment->tracking_method
                    : 'SEDEX';
                $track->valor      = $shipment->shipping_option->cost;
                $track->status     = 0;

                if ($track->save()) {
                    Log::info("Rastreio {$track->id} importado no pedido {$order->id}");
                } else {
                    Log::warning("Não foi possível importar o Rastreio {$track->id} para o pedido {$order->id}");
                }

                with(new RastreioController())->setDeadline($track);
            }

            return $track;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug('ML: Transaction - rollback');

            Log::critical(logMessage($e, 'ML: Pedido ' . $order->id . ' não importado'));
            reportError('Pedido ' . $order->id . ' não importado: ' . $e->getMessage() . ' - ' . $e->getLine());

            return false;
        }
    }
}
