<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToPedidoProdutosTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('pedido_produtos', function(Blueprint $table)
		{
			$table->foreign('pedido_id', 'PedidoProdutoPedido')->references('id')->on('pedidos')->onUpdate('CASCADE')->onDelete('CASCADE');
			$table->foreign('produto_sku', 'PedidoProdutoProduto')->references('sku')->on('produtos')->onUpdate('CASCADE')->onDelete('RESTRICT');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('pedido_produtos', function(Blueprint $table)
		{
			$table->dropForeign('PedidoProdutoPedido');
			$table->dropForeign('PedidoProdutoProduto');
		});
	}

}
