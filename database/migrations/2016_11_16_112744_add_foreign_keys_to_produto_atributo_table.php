<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToProdutoAtributoTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('produto_atributo', function(Blueprint $table)
		{
			$table->foreign('opcao_id', 'OpcaoProdutoAtributoOpcao')->references('id')->on('linha_atributo_opcoes')->onUpdate('CASCADE')->onDelete('CASCADE');
			$table->foreign('atributo_id', 'ProdutoAtributoAtributo')->references('id')->on('linha_atributos')->onUpdate('CASCADE')->onDelete('RESTRICT');
			$table->foreign('produto_sku', 'ProdutoAtributoProduto')->references('sku')->on('produtos')->onUpdate('CASCADE')->onDelete('CASCADE');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('produto_atributo', function(Blueprint $table)
		{
			$table->dropForeign('OpcaoProdutoAtributoOpcao');
			$table->dropForeign('ProdutoAtributoAtributo');
			$table->dropForeign('ProdutoAtributoProduto');
		});
	}

}
