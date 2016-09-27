<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use App\Models\Pedido\Pedido;
use App\Models\Pedido\Rastreio;
use App\Models\Pedido\Rastreio\Devolucao;
use App\Models\Pedido\Rastreio\Pi;
use App\Models\Pedido\Rastreio\Logistica;

class MoveProtocoloColumnToPedidoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $pis = Pi::where('protocolo', '!=', 0)->whereNotNull('protocolo')->get();
        foreach ($pis as $pi) {
            if ($rastreio = Rastreio::find($pi->rastreio_id)) {
                if ($pedido = Pedido::find($rastreio->pedido_id)) {
                    $pedido->protocolo = $pi->protocolo;
                    $pedido = $pedido->save();
                }
            }
        }

        $devolucoes = Devolucao::where('protocolo', '!=', 0)->whereNotNull('protocolo')->get();
        foreach ($devolucoes as $devolucao) {
            if ($rastreio = Rastreio::find($devolucao->rastreio_id)) {
                if ($pedido = Pedido::find($rastreio->pedido_id)) {
                    $pedido->protocolo = $devolucao->protocolo;
                    $pedido = $pedido->save();
                }
            }
        }

        $logisticas = Logistica::where('protocolo', '!=', 0)->whereNotNull('protocolo')->get();
        foreach ($logisticas as $logistica) {
            if ($rastreio = Rastreio::find($logistica->rastreio_id)) {
                if ($pedido = Pedido::find($rastreio->pedido_id)) {
                    $pedido->protocolo = $logistica->protocolo;
                    $pedido = $pedido->save();
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
    }
}
