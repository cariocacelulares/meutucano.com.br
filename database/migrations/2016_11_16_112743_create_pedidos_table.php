<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreatePedidosTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('pedidos', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('cliente_id')->unsigned()->index('PedidoCliente');
			$table->integer('cliente_endereco_id')->unsigned()->index('PedidoClienteEndereco');
			$table->string('codigo_api', 50)->nullable();
			$table->decimal('frete_valor', 10)->nullable();
			$table->string('frete_metodo', 30)->nullable();
			$table->string('pagamento_metodo', 30)->nullable();
			$table->string('codigo_marketplace', 30)->nullable();
			$table->string('marketplace', 30)->nullable()->default('');
			$table->integer('operacao');
			$table->decimal('total', 10);
			$table->date('estimated_delivery')->nullable();
			$table->integer('status')->nullable();
			$table->string('protocolo', 40)->nullable();
			$table->boolean('segurado')->default(0);
			$table->boolean('reembolso')->default(0);
			$table->boolean('priorizado')->nullable();
			$table->timestamps();
			$table->softDeletes();
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('pedidos');
	}

}
