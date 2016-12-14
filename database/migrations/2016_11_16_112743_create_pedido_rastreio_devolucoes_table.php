<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreatePedidoRastreioDevolucoesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('pedido_rastreio_devolucoes', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('rastreio_id')->unsigned()->index('DevolucaoPedidoRastreio');
			$table->boolean('motivo');
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
		Schema::drop('pedido_rastreio_devolucoes');
	}

}
