<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToGamificationSolicitacoesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('gamification_solicitacoes', function(Blueprint $table)
		{
			$table->foreign('tarefa_id', 'SolicitacoesTarefasTarefa')->references('id')->on('gamification_tarefas')->onUpdate('RESTRICT')->onDelete('CASCADE');
			$table->foreign('usuario_id', 'SolicitacoesUsuariosUsuario')->references('id')->on('usuarios')->onUpdate('RESTRICT')->onDelete('CASCADE');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('gamification_solicitacoes', function(Blueprint $table)
		{
			$table->dropForeign('SolicitacoesTarefasTarefa');
			$table->dropForeign('SolicitacoesUsuariosUsuario');
		});
	}

}
