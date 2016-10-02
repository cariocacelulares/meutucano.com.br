<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGamificationTarefasCategoriasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('gamification_tarefas_categorias', function(Blueprint $table) {
            $table->increments('id');
            $table->integer('tarefa_id')->unsigned()->index();
            $table->integer('categoria_id')->unsigned()->index();
            $table->timestamps();
        });

        Schema::table('gamification_tarefas_categorias', function(Blueprint $table) {
            $table->foreign('categoria_id', 'TarefasCategoriaCategoria')->references('id')->on('gamification_categorias')->onDelete('cascade');
            $table->foreign('tarefa_id', 'TarefasCategoriaTarefa')->references('id')->on('gamification_tarefas')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('gamification_tarefas_categorias', function(Blueprint $table)
        {
            $table->dropForeign('TarefasCategoriaCategoria');
            $table->dropForeign('TarefasCategoriaTarefa');
        });

        Schema::dropIfExists('gamification_tarefas_categorias');
    }
}
