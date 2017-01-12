<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateProdutosTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('produtos', function(Blueprint $table)
		{
			$table->increments('sku');
			$table->integer('marca_id')->unsigned()->nullable()->index('ProdutoMarcaProduto');
			$table->integer('linha_id')->unsigned()->nullable()->index('ProdutoLinhaProduto');
			$table->string('titulo')->default('');
			$table->integer('ncm')->nullable();
			$table->integer('ean')->nullable();
			$table->integer('referencia')->nullable();
			$table->char('unidade', 5)->nullable();
			$table->integer('estoque')->default(0);
			$table->boolean('controle_serial')->default(0);
			$table->boolean('ativo')->default(1);
			$table->boolean('estado')->default(0);
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
		Schema::drop('produtos');
	}

}
