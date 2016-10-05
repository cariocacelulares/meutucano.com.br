<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterStatusFieldDefaultToNullOnPedidoRastreioPisTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('pedido_rastreio_pis', function (Blueprint $table) {
            $table->boolean('status')->nullable()->default(null)->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('pedido_rastreio_pis', function (Blueprint $table) {
            $table->boolean('status')->nullable()->default(0)->change();
        });
    }
}
