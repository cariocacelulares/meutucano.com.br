<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateGamificationUsuarioTarefasTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('gamification_usuario_tarefas', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('usuario_id')->unsigned()->index();
			$table->integer('tarefa_id')->unsigned()->index();
			$table->integer('pontos')->default(0);
			$table->integer('moedas')->default(0);
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
		Schema::drop('gamification_usuario_tarefas');
	}

}
