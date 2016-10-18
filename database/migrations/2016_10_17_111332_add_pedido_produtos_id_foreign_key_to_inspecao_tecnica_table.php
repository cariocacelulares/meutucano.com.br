<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddPedidoProdutosIdForeignKeyToInspecaoTecnicaTable extends Migration
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
            $table->foreign('pedido_produtos_id', 'InspecaoTecnicaPedidoProdutos')->references('id')->on('pedido_produtos')->onUpdate('CASCADE')->onDelete('NO ACTION');
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
            $table->dropForeign('InspecaoTecnicaPedidoProdutos');
        });
    }

}
