<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class FixProdutoIdToProdutoSku extends Migration
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
            $table->dropForeign('ProdutoAtributoProduto');
        });

        Schema::table('produto_atributo', function(Blueprint $table)
        {
            $table->renameColumn('produto_id', 'produto_sku');
        });

        Schema::table('produto_atributo', function(Blueprint $table)
        {
            $table->foreign('produto_sku', 'ProdutoAtributoProduto')->references('sku')->on('produtos')->onUpdate('CASCADE')->onDelete('CASCADE');
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
        });

        Schema::table('produto_atributo', function(Blueprint $table)
        {
            $table->renameColumn('produto_sku', 'produto_id');
        });

        Schema::table('produto_atributo', function(Blueprint $table)
        {
            $table->foreign('produto_id', 'ProdutoAtributoProduto')->references('sku')->on('produtos')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }
}