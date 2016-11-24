<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreatePedidoImpostosTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('pedido_impostos', function(Blueprint $table)
		{
			$table->increments('pedido_id');
			$table->decimal('icms', 10)->nullable();
			$table->decimal('pis', 10)->nullable();
			$table->decimal('cofins', 10)->nullable();
			$table->decimal('icms_destinatario', 10)->nullable();
			$table->decimal('icms_remetente', 10)->nullable();
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('pedido_impostos');
	}

}
