<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddForeignKeysToInspecaoTecnicaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('inspecao_tecnica', function(Blueprint $table)
        {
            $table->foreign('usuario_id', 'InspecaoTecnicaUsuario')->references('id')->on('usuarios')->onUpdate('CASCADE')->onDelete('NO ACTION');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('inspecao_tecnica', function(Blueprint $table)
        {
            $table->dropForeign('InspecaoTecnicaUsuario');
        });
    }
}