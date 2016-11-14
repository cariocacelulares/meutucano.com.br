<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGamificationRankingTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('gamification_ranking', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('usuario_id')->unsigned()->nullable()->index();
            $table->integer('pontos')->unsigned()->default(0);
            $table->integer('votos')->unsigned()->default(0);
            $table->integer('tarefas')->unsigned()->default(0);
            $table->unsignedTinyInteger('mes')->unsigned();
            $table->unsignedSmallInteger('ano')->unsigned();
            $table->timestamps();
        });

        Schema::table('gamification_ranking', function(Blueprint $table) {
            $table->foreign('usuario_id', 'GamificationRankingUsuarios')->references('id')->on('usuarios');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('gamification_ranking', function(Blueprint $table)
        {
            $table->dropForeign('GamificationRankingUsuarios');
        });

        Schema::drop('gamification_ranking');
    }
}
