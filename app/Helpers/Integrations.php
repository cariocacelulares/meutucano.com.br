<?php

/**
 * Return the right API service for the shipment
 *
 * @param  OrderShipment $shipment
 * @return ShipmentApiInterface
 */
function shipment($shipment)
{
    $service = ucfirst($shipment->shipmentMethod->service);

    if (!$service)
        throw new \Exception("Shipment Method without service associated.");

    $apiClass = "\\{$service}\Services\Shipment\Api";

    if (!class_exists($apiClass))
        throw new \Exception("API Class not configured.");

    return new $apiClass($shipment);
}
