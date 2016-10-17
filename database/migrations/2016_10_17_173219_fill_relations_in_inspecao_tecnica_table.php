<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use App\Models\Inspecao\InspecaoTecnica;
use App\Models\Pedido\PedidoProduto;

class FillRelationsInInspecaoTecnicaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $inspecoes = InspecaoTecnica
            ::whereNull('pedido_produtos_id')
            ->get();

        foreach ($inspecoes as $inspecao) {
            if ($pedidoProduto = PedidoProduto::where('imei', '=', $inspecao->imei)->first()) {
                $inspecao->pedido_produtos_id = $pedidoProduto->id;
                $inspecao->produto_sku = $pedidoProduto->produto_sku;
                $inspecao->save();
            }
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Não tem como saber =(
    }
}
