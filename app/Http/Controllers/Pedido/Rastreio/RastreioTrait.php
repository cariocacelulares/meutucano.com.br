<?php namespace App\Http\Controllers\Pedido\Rastreio;

use App\Models\Pedido\Rastreio;
use App\Models\Pedido\Pedido;

/**
 * Class RastreioTrait
 * @package App\Http\Controllers\Pedido\Rastreio
 */
trait RastreioTrait
{
    /**
     * Atualiza o protocolo e o status
     *
     * @param  Object $obj      Pi, Devolucao ou Logistica
     * @param  int $protocol    numero de procolo
     * @return void
     */
    public function updateProtocolAndStatus($obj, $protocol) {
        if ((int)$obj->acao === 1 && $protocol) {
            if ($rastreio = Rastreio::find($obj->rastreio_id)) {
                if ($pedido = Pedido::find($rastreio->pedido_id)) {
                    $pedido->protocolo = $protocol;
                    $pedido->status = 5;
                    $pedido->save();
                }
            }
        }
    }
}