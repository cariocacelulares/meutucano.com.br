<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGamificationSolicitacoes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('gamification_solicitacoes', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('usuario_id')->unsigned()->index();
            $table->integer('tarefa_id')->unsigned()->index();
            $table->longText('descricao')->nullable();
            $table->boolean('status')->nullable()->default(null);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::table('gamification_solicitacoes', function(Blueprint $table) {
            $table->foreign('usuario_id', 'SolicitacoesUsuariosUsuario')->references('id')->on('usuarios')->onDelete('cascade');
            $table->foreign('tarefa_id', 'SolicitacoesTarefasTarefa')->references('id')->on('gamification_tarefas')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('gamification_solicitacoes', function(Blueprint $table)
        {
            $table->dropForeign('SolicitacoesUsuariosUsuario');
            $table->dropForeign('SolicitacoesTarefasTarefa');
        });

        Schema::dropIfExists('gamification_solicitacoes');
    }
}
