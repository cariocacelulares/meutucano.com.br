<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateLinhaAtributoOpcoesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('linha_atributo_opcoes', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('atributo_id')->unsigned()->index('OpcoesAtributoOpcao');
			$table->string('valor', 100);
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('linha_atributo_opcoes');
	}

}
