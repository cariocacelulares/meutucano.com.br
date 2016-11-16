<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateGamificationFilaTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('gamification_fila', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('usuario_id')->unsigned()->index();
			$table->integer('tarefa_id')->unsigned()->index();
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
		Schema::drop('gamification_fila');
	}

}
