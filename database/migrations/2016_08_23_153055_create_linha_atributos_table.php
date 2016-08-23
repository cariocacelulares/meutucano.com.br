<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLinhaAtributosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('linha_atributos', function(Blueprint $table)
        {
            $table->increments('id');
            $table->integer('linha_id')->unsigned();
            $table->string('titulo', 30);
            $table->tinyInteger('tipo')->default(0)->comment('0 - texto, 1 - selecao');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('linha_atributos');
    }
}
