<?php namespace App\Http\Controllers\Integracao;

/**
 * Interface Integracao
 * @package App\Http\Controllers\Integracao
 */
interface Integracao
{
    function parseStatus($status, $reverse = false);
    function parseShippingMethod($shipping);
    function parsePaymentMethod($payments);
    function request($url = null, $params = [], $method = 'GET');
    function importPedido($order);
    function queue();
    function syncOrder($order);
    function cancelOrder($order);
    function orderInvoice($id);
}