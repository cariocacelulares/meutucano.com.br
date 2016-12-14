<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToGamificationRankingTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('gamification_ranking', function(Blueprint $table)
		{
			$table->foreign('usuario_id', 'GamificationRankingUsuarios')->references('id')->on('usuarios')->onUpdate('RESTRICT')->onDelete('RESTRICT');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('gamification_ranking', function(Blueprint $table)
		{
			$table->dropForeign('GamificationRankingUsuarios');
		});
	}

}
