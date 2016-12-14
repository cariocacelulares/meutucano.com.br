<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToGamificationUsuarioTarefasTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('gamification_usuario_tarefas', function(Blueprint $table)
		{
			$table->foreign('tarefa_id', 'UsuarioTarefasTarefa')->references('id')->on('gamification_tarefas')->onUpdate('RESTRICT')->onDelete('CASCADE');
			$table->foreign('usuario_id', 'UsuarioTarefasUsuario')->references('id')->on('usuarios')->onUpdate('RESTRICT')->onDelete('CASCADE');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('gamification_usuario_tarefas', function(Blueprint $table)
		{
			$table->dropForeign('UsuarioTarefasTarefa');
			$table->dropForeign('UsuarioTarefasUsuario');
		});
	}

}
