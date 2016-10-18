<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class SetUsuarioIdNullableInspecaoTecnicaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('inspecao_tecnica', function (Blueprint $table) {
            $table->dropForeign('InspecaoTecnicaUsuario');
            $table->dropIndex('inspecao_tecnica_usuario_id_index');
        });

        Schema::table('inspecao_tecnica', function (Blueprint $table) {
            $table->integer('usuario_id')->unsigned()->nullable()->default(null)->index('inspecao_tecnica_usuario_id_index')->change();
        });

        Schema::table('inspecao_tecnica', function (Blueprint $table) {
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
        Schema::table('inspecao_tecnica', function (Blueprint $table) {
            $table->dropForeign('InspecaoTecnicaUsuario');
            $table->dropIndex('inspecao_tecnica_usuario_id_index');
        });

        Schema::table('inspecao_tecnica', function (Blueprint $table) {
            $table->integer('usuario_id')->unsigned()->nullable(false)->index('inspecao_tecnica_usuario_id_index')->change();
        });

        Schema::table('inspecao_tecnica', function (Blueprint $table) {
            $table->foreign('usuario_id', 'InspecaoTecnicaUsuario')->references('id')->on('usuarios')->onUpdate('CASCADE')->onDelete('NO ACTION');
        });
    }
}
