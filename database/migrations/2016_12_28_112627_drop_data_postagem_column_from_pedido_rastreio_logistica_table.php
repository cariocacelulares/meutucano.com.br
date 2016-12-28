<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DropDataPostagemColumnFromPedidoRastreioLogisticaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
		Schema::table('pedido_rastreio_logisticas', function(Blueprint $table)
		{
			$table->dropColumn('data_postagem');
		});
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
		Schema::table('pedido_rastreio_logisticas', function(Blueprint $table)
		{
			$table->date('data_postagem')->nullable();
		});
    }
}
