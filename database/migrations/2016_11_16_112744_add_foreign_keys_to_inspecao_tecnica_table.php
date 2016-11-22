<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToInspecaoTecnicaTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('inspecao_tecnica', function(Blueprint $table)
		{
			$table->foreign('pedido_produtos_id', 'InspecaoTecnicaPedidoProdutos')->references('id')->on('pedido_produtos')->onUpdate('CASCADE')->onDelete('NO ACTION');
			$table->foreign('produto_sku', 'InspecaoTecnicaProduto')->references('sku')->on('produtos')->onUpdate('CASCADE')->onDelete('NO ACTION');
			$table->foreign('solicitante_id', 'InspecaoTecnicaSolicitanteUsuario')->references('id')->on('usuarios')->onUpdate('CASCADE')->onDelete('NO ACTION');
			$table->foreign('usuario_id', 'InspecaoTecnicaUsuario')->references('id')->on('usuarios')->onUpdate('CASCADE')->onDelete('NO ACTION');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('inspecao_tecnica', function(Blueprint $table)
		{
			$table->dropForeign('InspecaoTecnicaPedidoProdutos');
			$table->dropForeign('InspecaoTecnicaProduto');
			$table->dropForeign('InspecaoTecnicaSolicitanteUsuario');
			$table->dropForeign('InspecaoTecnicaUsuario');
		});
	}

}
