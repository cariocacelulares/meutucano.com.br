<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateGamificationRecompensasTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('gamification_recompensas', function(Blueprint $table)
		{
			$table->increments('id');
			$table->string('titulo');
			$table->integer('valor')->unsigned()->default(1);
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
		Schema::drop('gamification_recompensas');
	}

}
