<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateInspecaoTecnicaTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('inspecao_tecnica', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('usuario_id')->unsigned()->nullable()->index();
			$table->integer('solicitante_id')->unsigned()->nullable()->index();
			$table->integer('pedido_produtos_id')->unsigned()->nullable()->index();
			$table->integer('produto_sku')->unsigned()->nullable()->index();
			$table->text('descricao', 65535)->nullable();
			$table->boolean('priorizado')->default(0);
			$table->boolean('reservado')->default(0);
			$table->dateTime('revisado_at')->nullable();
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
		Schema::drop('inspecao_tecnica');
	}

}
