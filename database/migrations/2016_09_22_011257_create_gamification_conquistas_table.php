<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGamificationConquistasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('gamification_conquistas', function(Blueprint $table) {
            $table->increments('id');
            $table->string('titulo', 150);
            $table->string('slug', 150)->unique();
            $table->string('icone', 250);
            $table->integer('tarefa_id')->unsigned()->index()->nullable();
            $table->integer('quantidade')->unsigned()->nullable();
            $table->tinyInteger('tempo')->unsigned()->nullable();
            $table->timestamps();
        });

        Schema::table('gamification_conquistas', function(Blueprint $table) {
            $table->foreign('tarefa_id', 'GamificationConquistasTarefa')->references('id')->on('gamification_tarefas');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('gamification_conquistas', function(Blueprint $table)
        {
            $table->dropForeign('GamificationConquistasTarefa');
        });

        Schema::dropIfExists('gamification_conquistas');
    }
}
