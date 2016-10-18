<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddPedidoProdutosIdToInspecaoTecnicaTable extends Migration
{

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('inspecao_tecnica', function (Blueprint $table) {
            $table->integer('pedido_produtos_id')->unsigned()->index()->nullable()->after('usuario_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('inspecao_tecnica', function (Blueprint $table) {
            $table->dropColumn('pedido_produtos_id');
        });
    }
}
