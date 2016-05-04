<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToUsuarioSenhasTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('usuario_senhas', function(Blueprint $table)
		{
			$table->foreign('usuario_id', 'UsuarioSenhaUsuario')->references('id')->on('usuarios')->onUpdate('CASCADE')->onDelete('CASCADE');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('usuario_senhas', function(Blueprint $table)
		{
			$table->dropForeign('UsuarioSenhaUsuario');
		});
	}

}
