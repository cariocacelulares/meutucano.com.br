<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToLinhaAtributosTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('linha_atributos', function(Blueprint $table)
		{
			$table->foreign('linha_id', 'LinhaAtributoLinha')->references('id')->on('linhas')->onUpdate('CASCADE')->onDelete('CASCADE');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('linha_atributos', function(Blueprint $table)
		{
			$table->dropForeign('LinhaAtributoLinha');
		});
	}

}
