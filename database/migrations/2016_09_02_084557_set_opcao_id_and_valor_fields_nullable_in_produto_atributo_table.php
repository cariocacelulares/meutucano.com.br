<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class SetOpcaoIdAndValorFieldsNullableInProdutoAtributoTable extends Migration
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
            $table->integer('opcao_id')->unsigned()->nullable()->change();
            $table->text('valor', 150)->nullable()->change();
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
            $table->integer('opcao_id')->unsigned()->change();
            $table->text('valor', 150)->change();
        });
    }
}
