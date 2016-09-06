<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddOpcaoFkToProdutoAtributoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('produto_atributo', function(Blueprint $table)
        {
            $table->foreign('opcao_id', 'OpcaoProdutoAtributoOpcao')->references('id')->on('linha_atributo_opcoes')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('produto_atributo', function(Blueprint $table)
        {
            $table->dropForeign('OpcaoProdutoAtributoOpcao');
        });
    }
}
