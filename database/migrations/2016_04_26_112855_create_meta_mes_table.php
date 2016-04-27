<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateMetaMesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('meta_mes', function(Blueprint $table)
		{
			$table->integer('ano')->unsigned();
			$table->integer('mes')->unsigned();
			$table->decimal('valor', 10)->default(0.00);
			$table->integer('tipo')->default(0);
			$table->primary(['ano','mes','tipo']);
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('meta_mes');
	}

}
