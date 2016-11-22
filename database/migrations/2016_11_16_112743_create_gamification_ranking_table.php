<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateGamificationRankingTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('gamification_ranking', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('usuario_id')->unsigned()->nullable()->index();
			$table->integer('pontos')->unsigned()->default(0);
			$table->integer('votos')->unsigned()->default(0);
			$table->integer('tarefas')->unsigned()->default(0);
			$table->boolean('mes');
			$table->smallInteger('ano')->unsigned();
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
		Schema::drop('gamification_ranking');
	}

}
