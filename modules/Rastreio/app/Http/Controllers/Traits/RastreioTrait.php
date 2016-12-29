<?php namespace Rastreio\Http\Controllers\Traits;

use Illuminate\Support\Facades\DB;
use Core\Models\Pedido\Pedido;
use Rastreio\Models\Rastreio;
use Rastreio\Models\Logistica;
use Rastreio\Models\Devolucao;
use Rastreio\Models\Pi;

/**
 * Class RastreioTrait
 * @package Rastreio\Http\Controllers\Traits
 */
trait RastreioTrait
{
    /**
     * Cancela o pedido diretamente para nao acionar os hadlers
     *
     * @param  int $id id do pedido
     * @return boolean
     */
    public function cancelOrder($id)
    {
        try {
            $query = DB::table(with(new Pedido)->getTable())
                ->where('id', '=', $id)
                ->update([
                    'status' => 5
                ]);

            return !!$query;
        } catch (\Exception $e) {
        }

        \Log::warning('Não foi possível cancelar o pedido diretamente, corrija o estoque!', ['pedido' => $id]);

        return false;
    }

    /**
     * Verfica se o motivo não deve mecher no estoque, e faz a query sem ativar os handler
     *
     * @param  Object $obj
     * @param  int $orderId
     * @return boolean
     */
    public function rawCancel($obj, $orderId) {
        if (!isset($obj->motivo) && !isset($obj->motivo_status)) {
            return false;
        }

        $raw = false;
        if ($obj instanceof Logistica || strstr(get_class($obj), 'Logistica')) {
            $raw = ((int)$obj->motivo === 0); // defeito
        } elseif ($obj instanceof Devolucao || strstr(get_class($obj), 'Devolucao')) {
            $raw = ((int)$obj->motivo === 5); // defeito
        } elseif ($obj instanceof Pi || strstr(get_class($obj), 'Pi')) {
            $raw = ((int)$obj->motivo_status === 3); // extravio
        }

        if ($raw) {
            return $this->cancelOrder($orderId);
        }

        return false;
    }

    /**
     * Atualiza o protocolo e o status
     *
     * @param  Object $obj      Pi, Devolucao ou Logistica
     * @param  int $protocol    numero de procolo
     * @return void
     */
    public function updateProtocolAndStatus($obj, $protocol, $imagem = false)
    {
        if ((int)$obj->acao === 1) {
            if ($rastreio = Rastreio::find($obj->rastreio_id)) {
                if ($pedido = Pedido::find($rastreio->pedido_id)) {
                    if (in_array(strtolower($pedido->marketplace), ['site', 'mercadolivre'])) {
                        $pedido->protocolo = $protocol;

                        if (!$this->rawCancel($obj, $pedido->id)) {
                            $pedido->status = 5;
                        }

                        $pedido->save();
                    } elseif ($protocol) {
                        $pedido->protocolo = $protocol;

                        if (!$this->rawCancel($obj, $pedido->id)) {
                            $pedido->status = 5;
                        }

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
