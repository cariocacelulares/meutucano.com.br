<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use App\Models\Pedido\Rastreio;
use App\Models\Pedido\Rastreio\Pi;
use App\Models\Pedido\Rastreio\Devolucao;
use App\Models\Pedido\Rastreio\Logistica;

class MoveProtocoloColumnToRastreioTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('pedido_rastreios', function (Blueprint $table) {
            $table->integer('protocolo')->nullable()->after('status');
        });

        $pis = Pi::all();
        foreach ($pis as $pi) {
            if ($pi->protocolo) {
                if ($rastreio = Rastreio::find($pi->rastreio_id)) {
                    $rastreio->protocolo = $pi->protocolo;
                    $rastreio->save();
                }
            }
        }

        $devolucoes = Devolucao::all();
        foreach ($devolucoes as $devolucao) {
            if ($devolucao->protocolo) {
                if ($rastreio = Rastreio::find($devolucao->rastreio_id)) {
                    $rastreio->protocolo = $devolucao->protocolo;
                    $rastreio->save();
                }
            }
        }

        $logisticas = Logistica::all();
        foreach ($logisticas as $logistica) {
            if ($logistica->protocolo) {
                if ($rastreio = Rastreio::find($logistica->rastreio_id)) {
                    $rastreio->protocolo = $logistica->protocolo;
                    $rastreio->save();
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
        Schema::table('pedido_rastreios', function (Blueprint $table) {
            $table->dropColumn('protocolo');
        });
    }
}
