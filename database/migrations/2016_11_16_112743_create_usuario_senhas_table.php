<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateUsuarioSenhasTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('usuario_senhas', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('usuario_id')->unsigned()->index('UsuarioSenhaUsuario');
			$table->string('site', 30)->nullable();
			$table->string('url')->nullable();
			$table->string('usuario', 80)->nullable();
			$table->string('senha', 30)->nullable();
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
		Schema::drop('usuario_senhas');
	}

}
