<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLinhaAtributoOpcoesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('linha_atributo_opcoes', function(Blueprint $table)
        {
            $table->increments('id');
            $table->integer('atributo_id')->unsigned();
            $table->string('valor', 100);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('linha_atributo_opcoes');
    }
}
