<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreatePedidoRastreioPisTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('pedido_rastreio_pis', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('rastreio_id')->unsigned()->index('PiPedidoRastreio');
			$table->integer('codigo_pi')->unsigned()->nullable();
			$table->boolean('motivo_status')->nullable();
			$table->boolean('status')->nullable();
			$table->date('data_pagamento')->nullable();
			$table->decimal('valor_pago', 10)->nullable();
			$table->boolean('acao')->nullable();
			$table->boolean('pago_cliente')->nullable()->default(0);
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
		Schema::drop('pedido_rastreio_pis');
	}

}
