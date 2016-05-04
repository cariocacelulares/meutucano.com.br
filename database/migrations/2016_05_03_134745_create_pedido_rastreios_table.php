<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreatePedidoRastreiosTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('pedido_rastreios', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('pedido_id')->unsigned()->index('PedidoRastreioPedido');
			$table->integer('rastreio_ref_id')->unsigned()->nullable()->index('PedidoRastreioRastreioRef');
			$table->boolean('tipo')->default(0);
			$table->date('data_envio');
			$table->string('rastreio', 20)->default('');
			$table->string('servico', 20)->nullable()->default('');
			$table->decimal('valor', 10)->nullable();
			$table->integer('prazo')->nullable();
			$table->string('observacao', 250)->nullable();
			$table->boolean('status');
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
		Schema::drop('pedido_rastreios');
	}

}
