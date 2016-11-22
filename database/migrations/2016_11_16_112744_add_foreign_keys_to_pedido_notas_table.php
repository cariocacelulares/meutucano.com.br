<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToPedidoNotasTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('pedido_notas', function(Blueprint $table)
		{
			$table->foreign('pedido_id', 'PedidoNotaPedido')->references('id')->on('pedidos')->onUpdate('CASCADE')->onDelete('CASCADE');
			$table->foreign('usuario_id', 'UsuarioNotaUsuario')->references('id')->on('usuarios')->onUpdate('CASCADE')->onDelete('NO ACTION');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('pedido_notas', function(Blueprint $table)
		{
			$table->dropForeign('PedidoNotaPedido');
			$table->dropForeign('UsuarioNotaUsuario');
		});
	}

}
