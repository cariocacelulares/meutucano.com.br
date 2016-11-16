<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateProdutoAtributoTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('produto_atributo', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('produto_sku')->unsigned()->index('ProdutoAtributoProduto');
			$table->integer('atributo_id')->unsigned()->index('ProdutoAtributoAtributo');
			$table->integer('opcao_id')->unsigned()->nullable()->index('OpcaoProdutoAtributoOpcao');
			$table->text('valor', 65535)->nullable();
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('produto_atributo');
	}

}
