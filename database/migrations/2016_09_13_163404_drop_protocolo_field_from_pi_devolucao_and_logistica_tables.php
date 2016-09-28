<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DropProtocoloFieldFromPiDevolucaoAndLogisticaTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('pedido_rastreio_logisticas', function (Blueprint $table) {
            $table->dropColumn('protocolo');
        });

        Schema::table('pedido_rastreio_devolucoes', function (Blueprint $table) {
            $table->dropColumn('protocolo');
        });

        Schema::table('pedido_rastreio_pis', function (Blueprint $table) {
            $table->dropColumn('protocolo');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('pedido_rastreio_logisticas', function(Blueprint $table) {
            $table->integer('protocolo')->nullable()->after('acao');
        });

        Schema::table('pedido_rastreio_devolucoes', function(Blueprint $table) {
            $table->integer('protocolo')->nullable()->after('acao');
        });

        Schema::table('pedido_rastreio_pis', function(Blueprint $table) {
            $table->integer('protocolo')->nullable()->after('acao');
        });
    }
}
