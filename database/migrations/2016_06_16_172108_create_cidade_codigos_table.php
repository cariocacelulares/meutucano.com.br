<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCidadeCodigosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cidade_codigos', function (Blueprint $table)
        {
            $table->integer('codigo')->unsigned()->primary();
            $table->string('uf', 2)->default('');
            $table->string('cidade')->default('');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('cidade_codigos');
    }
}
