<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToGamificationTrocasTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('gamification_trocas', function(Blueprint $table)
		{
			$table->foreign('recompensa_id', 'TrocasRecompensasRecompensa')->references('id')->on('gamification_recompensas')->onUpdate('RESTRICT')->onDelete('RESTRICT');
			$table->foreign('usuario_id', 'TrocasUsuariosUsuario')->references('id')->on('usuarios')->onUpdate('RESTRICT')->onDelete('CASCADE');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('gamification_trocas', function(Blueprint $table)
		{
			$table->dropForeign('TrocasRecompensasRecompensa');
			$table->dropForeign('TrocasUsuariosUsuario');
		});
	}

}
