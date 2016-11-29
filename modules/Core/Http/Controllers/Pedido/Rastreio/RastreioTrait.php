<?php namespace Modules\Core\Http\Controllers\Pedido\Rastreio;

use Modules\Core\Models\Pedido\Rastreio;
use Modules\Core\Models\Pedido\Pedido;

/**
 * Class RastreioTrait
 * @package Modules\Core\Http\Controllers\Pedido\Rastreio
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
    public function updateProtocolAndStatus($obj, $protocol, $imagem = false) {
        if ((int)$obj->acao === 1) {
            if ($rastreio = Rastreio::find($obj->rastreio_id)) {
                if ($pedido = Pedido::find($rastreio->pedido_id)) {
                    if (in_array(strtolower($pedido->marketplace), ['site', 'mercadolivre'])) {
                        $pedido->protocolo = $protocol;
                        $pedido->status = 5;

                        $pedido->save();
                    } else if ($protocol) {
                        $pedido->protocolo = $protocol;
                        $pedido->status = 5;

                        if ($imagem) {
                            $name = substr(str_slug($protocol . '-' . $imagem->getClientOriginalName()), 0, 200) . '.' . $imagem->extension();
                            $imagem->move(storage_path('app/public/cancelamento'), $name);
                            $pedido->imagem_cancelamento = $name;
                        }

                        $pedido->save();
                    }
                }
            }
        }
    }
}