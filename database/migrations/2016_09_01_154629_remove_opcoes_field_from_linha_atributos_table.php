<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RemoveOpcoesFieldFromLinhaAtributosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('linha_atributos', function (Blueprint $table) {
            $table->dropColumn(['opcoes', 'tipo']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('linha_atributos', function (Blueprint $table) {
            $table->tinyInteger('tipo')->default(0)->comment('0 - texto, 1 - selecao');
            $table->text('opcoes')->after('tipo');
        });
    }
}
