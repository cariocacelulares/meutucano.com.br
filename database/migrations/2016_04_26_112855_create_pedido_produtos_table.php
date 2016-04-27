<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreatePedidoProdutosTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('pedido_produtos', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('pedido_id')->unsigned();
			$table->integer('produto_sku')->unsigned();
			$table->decimal('valor', 10);
			$table->integer('quantidade')->unsigned()->default(1);
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('pedido_produtos');
	}

}
