<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class SetSkuFieldAutoincrementInProdutosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('pedido_produtos', function(Blueprint $table)
        {
            $table->dropForeign('PedidoProdutoProduto');
        });

        Schema::table('produto_atributo', function(Blueprint $table)
        {
            $table->dropForeign('ProdutoAtributoProduto');
        });

        Schema::table('produtos', function(Blueprint $table)
        {
            $table->increments('sku')->change();
        });

        Schema::table('pedido_produtos', function(Blueprint $table)
        {
            $table->foreign('produto_sku', 'PedidoProdutoProduto')->references('sku')->on('produtos')->onUpdate('CASCADE')->onDelete('RESTRICT');
        });

        Schema::table('produto_atributo', function(Blueprint $table)
        {
            $table->foreign('produto_id', 'ProdutoAtributoProduto')->references('sku')->on('produtos')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('produtos', function(Blueprint $table)
        {
            $table->integer('sku')->unsigned()->primary();
        });
    }
}
