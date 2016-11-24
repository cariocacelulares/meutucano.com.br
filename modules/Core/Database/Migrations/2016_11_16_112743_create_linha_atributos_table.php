<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateLinhaAtributosTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('linha_atributos', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('linha_id')->unsigned()->index('LinhaAtributoLinha');
			$table->string('titulo', 30);
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('linha_atributos');
	}

}
