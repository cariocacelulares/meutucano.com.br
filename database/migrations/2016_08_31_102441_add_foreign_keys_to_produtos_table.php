<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddForeignKeysToProdutosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('produtos', function(Blueprint $table)
        {
            $table->foreign('linha_id', 'ProdutoLinhaProduto')->references('id')->on('linhas')->onUpdate('CASCADE')->onDelete('RESTRICT');
            $table->foreign('marca_id', 'ProdutoMarcaProduto')->references('id')->on('marcas')->onUpdate('CASCADE')->onDelete('RESTRICT');
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
            $table->dropForeign('ProdutoLinhaProduto');
            $table->dropForeign('ProdutoMarcaProduto');
        });
    }
}
