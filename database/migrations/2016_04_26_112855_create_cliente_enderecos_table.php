<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateClienteEnderecosTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('cliente_enderecos', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('cliente_id')->unsigned();
			$table->integer('cep')->unsigned();
			$table->string('rua', 250)->nullable()->default('');
			$table->string('numero', 20)->nullable();
			$table->string('complemento', 200)->nullable();
			$table->string('bairro', 100)->nullable();
			$table->string('cidade', 100)->nullable();
			$table->char('uf', 2)->nullable();
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
		Schema::drop('cliente_enderecos');
	}

}
