<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddSolicitanteIdFieldToInspecaoTecnicaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('inspecao_tecnica', function (Blueprint $table) {
            $table->integer('solicitante_id')->unsigned()->nullable()->index()->after('usuario_id');
        });

        Schema::table('inspecao_tecnica', function(Blueprint $table)
        {
            $table->foreign('solicitante_id', 'InspecaoTecnicaSolicitanteUsuario')->references('id')->on('usuarios')->onUpdate('CASCADE')->onDelete('NO ACTION');
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
            $table->dropForeign('InspecaoTecnicaSolicitanteUsuario');
        });

        Schema::table('inspecao_tecnica', function (Blueprint $table) {
            $table->dropColumn('solicitante_id');
        });
    }
}
