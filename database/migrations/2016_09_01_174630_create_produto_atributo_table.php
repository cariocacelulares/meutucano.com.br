<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProdutoAtributoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('produto_atributo', function(Blueprint $table)
        {
            $table->integer('id')->unsigned()->primary();
            $table->integer('produto_id')->unsigned()->index('ProdutoAtributoProduto');
            $table->integer('atributo_id')->unsigned()->index('ProdutoAtributoAtributo');
            $table->integer('opcao_id')->unsigned();
            $table->text('valor', 150);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('produto_atributo');
    }
}
