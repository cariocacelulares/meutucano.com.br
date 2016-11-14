<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGamificationUsuarioTarefasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('gamification_usuario_tarefas', function(Blueprint $table) {
            $table->increments('id');
            $table->integer('usuario_id')->unsigned()->index();
            $table->integer('tarefa_id')->unsigned()->index();
            $table->integer('pontos')->unisigned()->default(0);
            $table->integer('moedas')->unisigned()->default(0);
            $table->timestamps();
        });

        Schema::table('gamification_usuario_tarefas', function(Blueprint $table) {
            $table->foreign('usuario_id', 'UsuarioTarefasUsuario')->references('id')->on('usuarios')->onDelete('cascade');
            $table->foreign('tarefa_id', 'UsuarioTarefasTarefa')->references('id')->on('gamification_tarefas')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('gamification_usuario_tarefas', function(Blueprint $table)
        {
            $table->dropForeign('UsuarioTarefasUsuario');
            $table->dropForeign('UsuarioTarefasTarefa');
        });

        Schema::dropIfExists('gamification_usuario_tarefas');
    }
}
