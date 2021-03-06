<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreatePedidoRastreioLogisticasTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('pedido_rastreio_logisticas', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('rastreio_id')->unsigned()->index('LogisticaPedidoRastreio');
			$table->integer('autorizacao')->nullable();
			$table->boolean('motivo');
			$table->boolean('acao')->nullable();
			$table->date('data_postagem')->nullable();
			$table->text('observacoes', 65535)->nullable();
			$table->timestamps();
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('pedido_rastreio_logisticas');
	}

}
