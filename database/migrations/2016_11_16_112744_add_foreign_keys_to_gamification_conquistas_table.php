<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToGamificationConquistasTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('gamification_conquistas', function(Blueprint $table)
		{
			$table->foreign('tarefa_id', 'GamificationConquistasTarefa')->references('id')->on('gamification_tarefas')->onUpdate('RESTRICT')->onDelete('RESTRICT');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('gamification_conquistas', function(Blueprint $table)
		{
			$table->dropForeign('GamificationConquistasTarefa');
		});
	}

}
