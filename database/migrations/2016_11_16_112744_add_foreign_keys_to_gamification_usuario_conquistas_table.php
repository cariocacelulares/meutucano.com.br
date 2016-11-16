<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToGamificationUsuarioConquistasTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('gamification_usuario_conquistas', function(Blueprint $table)
		{
			$table->foreign('conquista_id', 'UsuarioConquistasConquista')->references('id')->on('gamification_conquistas')->onUpdate('RESTRICT')->onDelete('CASCADE');
			$table->foreign('usuario_id', 'UsuarioConquistasUsuario')->references('id')->on('usuarios')->onUpdate('RESTRICT')->onDelete('CASCADE');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('gamification_usuario_conquistas', function(Blueprint $table)
		{
			$table->dropForeign('UsuarioConquistasConquista');
			$table->dropForeign('UsuarioConquistasUsuario');
		});
	}

}
