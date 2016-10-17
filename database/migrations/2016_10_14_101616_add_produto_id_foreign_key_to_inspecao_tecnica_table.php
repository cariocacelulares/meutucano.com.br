<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddProdutoIdForeignKeyToInspecaoTecnicaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('inspecao_tecnica', function(Blueprint $table)
        {
            $table->foreign('produto_sku', 'InspecaoTecnicaProduto')->references('sku')->on('produtos')->onUpdate('CASCADE')->onDelete('NO ACTION');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('inspecao_tecnica', function(Blueprint $table)
        {
            $table->dropForeign('InspecaoTecnicaProduto');
        });
    }
}
