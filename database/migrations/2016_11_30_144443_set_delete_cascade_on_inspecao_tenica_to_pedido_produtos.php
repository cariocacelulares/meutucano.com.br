<?php
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class SetDeleteCascadeOnInspecaoTenicaToPedidoProdutos extends Migration
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
            $table->dropForeign('InspecaoTecnicaPedidoProdutos');
        });

        Schema::table('inspecao_tecnica', function(Blueprint $table)
        {
            $table->foreign('pedido_produtos_id', 'InspecaoTecnicaPedidoProdutos')->references('id')->on('pedido_produtos')->onUpdate('NO ACTION')->onDelete('CASCADE');
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

        Schema::table('inspecao_tecnica', function(Blueprint $table)
        {
            $table->foreign('pedido_produtos_id', 'InspecaoTecnicaPedidoProdutos')->references('id')->on('pedido_produtos')->onUpdate('CASCADE')->onDelete('NO ACTION');
        });
    }
}
