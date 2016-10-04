<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGamificationFilaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('gamification_fila', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('usuario_id')->unsigned()->index();
            $table->integer('tarefa_id')->unsigned()->index();
            $table->timestamps();
        });

        Schema::table('gamification_fila', function(Blueprint $table) {
            $table->foreign('usuario_id', 'GamificationFilaUsuario')->references('id')->on('usuarios')->onDelete('cascade');
            $table->foreign('tarefa_id', 'GamificationFilaTarefa')->references('id')->on('gamification_tarefas')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('gamification_fila', function(Blueprint $table)
        {
            $table->dropForeign('GamificationFilaUsuario');
            $table->dropForeign('GamificationFilaTarefa');
        });

        Schema::dropIfExists('gamification_fila');
    }
}
