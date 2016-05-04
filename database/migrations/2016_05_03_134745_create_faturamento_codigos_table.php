<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateFaturamentoCodigosTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('faturamento_codigos', function(Blueprint $table)
		{
			$table->boolean('servico')->primary();
			$table->integer('atual')->unsigned();
			$table->integer('fim')->unsigned()->nullable();
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('faturamento_codigos');
	}

}
