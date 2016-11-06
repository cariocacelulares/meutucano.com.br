<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGamificationTrocasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('gamification_trocas', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('usuario_id')->unsigned()->index();
            $table->integer('recompensa_id')->unsigned()->index();
            $table->integer('valor')->unsigned()->default(1);
            $table->boolean('status')->default(false);
            $table->timestamps();
        });

        Schema::table('gamification_trocas', function(Blueprint $table) {
            $table->foreign('usuario_id', 'TrocasUsuario')->references('id')->on('usuarios')->onDelete('cascade');
            $table->foreign('recompensa_id', 'TrocasRecompensa')->references('id')->on('gamification_recompensas');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('gamification_trocas', function(Blueprint $table)
        {
            $table->dropForeign('TrocasUsuario');
            $table->dropForeign('TrocasRecompensa');
        });

        Schema::dropIfExists('gamification_trocas');
    }
}
