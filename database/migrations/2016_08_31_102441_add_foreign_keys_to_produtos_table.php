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
            $table->foreign('linha_id', 'ProdutoLinha')->references('id')->on('linhas')->onUpdate('CASCADE')->onDelete('RESTRICT');
            $table->foreign('marca_id', 'ProdutoMarca')->references('id')->on('marcas')->onUpdate('CASCADE')->onDelete('RESTRICT');
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
            $table->dropForeign('ProdutoLinha');
            $table->dropForeign('ProdutoMarca');
        });
    }
}
