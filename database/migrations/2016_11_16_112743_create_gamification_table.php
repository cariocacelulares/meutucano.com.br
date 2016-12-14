<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateGamificationTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('gamification', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('usuario_id')->unsigned()->index('GamificationUsuario');
			$table->string('avatar', 250)->nullable();
			$table->integer('moedas')->unsigned()->default(0);
			$table->integer('pontos')->unsigned()->default(0);
			$table->integer('experiencia')->unsigned()->default(0);
			$table->integer('nivel')->unsigned()->default(1);
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
		Schema::drop('gamification');
	}

}
