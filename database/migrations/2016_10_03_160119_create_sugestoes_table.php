<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSugestoesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sugestoes', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('usuario_id')->unsigned()->index();
            $table->boolean('anonimo')->default(true);
            $table->string('setor', 150)->nullable();
            $table->string('pessoa', 150)->nullable();
            $table->text('descricao');
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
        Schema::drop('sugestoes');
    }
}
