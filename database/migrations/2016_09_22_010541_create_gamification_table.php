<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGamificationTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('gamification', function(Blueprint $table) {
            $table->increments('id');
            $table->integer('usuario_id')->unsigned();
            $table->string('avatar', 250)->nullable()->default(null);
            $table->integer('moedas')->unsigned()->default(0);
            $table->integer('pontos')->unsigned()->default(0);
            $table->integer('experiencia')->unsigned()->default(0);
            $table->integer('nivel')->unsigned()->default(1);
            $table->timestamps();
        });

        Schema::table('gamification', function(Blueprint $table) {
            $table->foreign('usuario_id', 'GamificationUsuario')->references('id')->on('usuarios')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('gamification', function(Blueprint $table)
        {
            $table->dropForeign('GamificationUsuario');
        });

        Schema::dropIfExists('gamification');
    }
}
