<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddForeignKeysToOpcoesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('linha_atributo_opcoes', function(Blueprint $table)
        {
            $table->foreign('atributo_id', 'OpcoesAtributoOpcao')->references('id')->on('linha_atributos')->onUpdate('CASCADE')->onDelete('RESTRICT');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('linha_atributo_opcoes', function(Blueprint $table)
        {
            $table->dropForeign('OpcoesAtributoOpcao');
        });
    }
}
