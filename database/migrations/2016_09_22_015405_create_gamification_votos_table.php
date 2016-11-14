<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGamificationVotosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('gamification_votos', function(Blueprint $table) {
            $table->increments('id');
            $table->integer('eleitor_id')->unsigned()->index();
            $table->integer('candidato_id')->unsigned()->index();
            $table->timestamps();
        });

        Schema::table('gamification_votos', function(Blueprint $table) {
            $table->foreign('eleitor_id', 'EleitorVotosUsuario')->references('id')->on('usuarios')->onDelete('cascade');
            $table->foreign('candidato_id', 'CandidatoVotosUsuario')->references('id')->on('usuarios')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('gamification_votos', function(Blueprint $table)
        {
            $table->dropForeign('EleitorVotosUsuario');
            $table->dropForeign('CandidatoVotosUsuario');
        });

        Schema::dropIfExists('gamification_votos');
    }
}
