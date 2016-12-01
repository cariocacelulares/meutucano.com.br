<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToGamificationFilaTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('gamification_fila', function(Blueprint $table)
		{
			$table->foreign('tarefa_id', 'GamificationFilaTarefa')->references('id')->on('gamification_tarefas')->onUpdate('RESTRICT')->onDelete('CASCADE');
			$table->foreign('usuario_id', 'GamificationFilaUsuario')->references('id')->on('usuarios')->onUpdate('RESTRICT')->onDelete('CASCADE');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('gamification_fila', function(Blueprint $table)
		{
			$table->dropForeign('GamificationFilaTarefa');
			$table->dropForeign('GamificationFilaUsuario');
		});
	}

}
