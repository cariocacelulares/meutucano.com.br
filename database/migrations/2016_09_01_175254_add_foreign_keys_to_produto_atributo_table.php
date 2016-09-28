<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddForeignKeysToProdutoAtributoTable extends Migration
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
            $table->foreign('produto_id', 'ProdutoAtributoProduto')->references('sku')->on('produtos')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign('atributo_id', 'ProdutoAtributoAtributo')->references('id')->on('linha_atributos')->onUpdate('CASCADE')->onDelete('RESTRICT');
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
            $table->dropForeign('ProdutoAtributoProduto');
            $table->dropForeign('ProdutoAtributoAtributo');
        });
    }
}
