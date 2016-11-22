<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateGamificationConquistasTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('gamification_conquistas', function(Blueprint $table)
		{
			$table->increments('id');
			$table->string('titulo', 150);
			$table->string('slug', 150)->unique();
			$table->string('icone', 250);
			$table->integer('tarefa_id')->unsigned()->nullable()->index();
			$table->integer('quantidade')->unsigned()->nullable();
			$table->boolean('tempo')->nullable();
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
		Schema::drop('gamification_conquistas');
	}

}
