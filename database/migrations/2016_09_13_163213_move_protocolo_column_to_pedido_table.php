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
        Schema::table('pedidos', function (Blueprint $table) {
            $table->integer('protocolo')->nullable()->after('status');
        });

        $pis = Pi::all();
        foreach ($pis as $pi) {
            if ($pi->protocolo) {
                if ($rastreio = Rastreio::find($pi->rastreio_id)) {
                    if ($pedido = Pedido::find($rastreio->pedido_id)) {
                        $pedido->protocolo = $pi->protocolo;
                        $pedido->save();
                    }
                }
            }
        }

        $devolucoes = Devolucao::all();
        foreach ($devolucoes as $devolucao) {
            if ($devolucao->protocolo) {
                if ($rastreio = Rastreio::find($devolucao->rastreio_id)) {
                    if ($pedido = Pedido::find($rastreio->pedido_id)) {
                        $pedido->protocolo = $devolucao->protocolo;
                        $pedido->save();
                    }
                }
            }
        }

        $logisticas = Logistica::all();
        foreach ($logisticas as $logistica) {
            if ($logistica->protocolo) {
                if ($rastreio = Rastreio::find($logistica->rastreio_id)) {
                    if ($pedido = Pedido::find($rastreio->pedido_id)) {
                        $pedido->protocolo = $logistica->protocolo;
                        $pedido->save();
                    }
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
        Schema::table('pedidos', function (Blueprint $table) {
            $table->dropColumn('protocolo');
        });
    }
}
