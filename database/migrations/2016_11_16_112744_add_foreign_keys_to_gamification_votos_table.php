<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToGamificationVotosTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('gamification_votos', function(Blueprint $table)
		{
			$table->foreign('candidato_id', 'CandidatoVotosUsuario')->references('id')->on('usuarios')->onUpdate('RESTRICT')->onDelete('CASCADE');
			$table->foreign('eleitor_id', 'EleitorVotosUsuario')->references('id')->on('usuarios')->onUpdate('RESTRICT')->onDelete('CASCADE');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('gamification_votos', function(Blueprint $table)
		{
			$table->dropForeign('CandidatoVotosUsuario');
			$table->dropForeign('EleitorVotosUsuario');
		});
	}

}
