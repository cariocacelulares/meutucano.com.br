<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGamificationTarefasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('gamification_tarefas', function(Blueprint $table) {
            $table->increments('id');
            $table->string('titulo');
            $table->string('slug')->unique();
            $table->integer('pontos')->unsigned()->default(0);
            $table->integer('moedas')->unsigned()->default(0);
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
        Schema::dropIfExists('gamification_tarefas');
    }
}
