<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToClienteEnderecosTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('cliente_enderecos', function(Blueprint $table)
		{
			$table->foreign('cliente_id', 'ClienteEnderecoCliente')->references('id')->on('clientes')->onUpdate('CASCADE')->onDelete('CASCADE');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('cliente_enderecos', function(Blueprint $table)
		{
			$table->dropForeign('ClienteEnderecoCliente');
		});
	}

}
