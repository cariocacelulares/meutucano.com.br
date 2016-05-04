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
			$table->integer('sku')->unsigned()->primary();
			$table->string('titulo')->default('');
			$table->integer('ncm')->default(85171231);
			$table->integer('ean')->nullable();
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
