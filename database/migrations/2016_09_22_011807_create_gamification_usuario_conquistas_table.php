<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGamificationUsuarioConquistasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('gamification_usuario_conquistas', function(Blueprint $table) {
            $table->increments('id');
            $table->integer('usuario_id')->unsigned()->index();
            $table->integer('conquista_id')->unsigned()->index();
            $table->timestamps();
        });

        Schema::table('gamification_usuario_conquistas', function(Blueprint $table) {
            $table->foreign('usuario_id', 'UsuarioConquistasUsuario')->references('id')->on('usuarios')->onDelete('cascade');
            $table->foreign('conquista_id', 'UsuarioConquistasConquista')->references('id')->on('gamification_conquistas')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('gamification_usuario_conquistas', function(Blueprint $table)
        {
            $table->dropForeign('UsuarioConquistasUsuario');
            $table->dropForeign('UsuarioConquistasConquista');
        });

        Schema::dropIfExists('gamification_usuario_conquistas');
    }
}
