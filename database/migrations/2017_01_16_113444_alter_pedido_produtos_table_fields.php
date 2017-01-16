<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Core\Models\PedidoProduto;

class AlterPedidoProdutosTableFields extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $productImeis = [];

        $orderProductsWithImei = DB::table('pedido_produtos')
            ->whereNotNull('imei')
            ->get();

        foreach ($orderProductsWithImei as $orderProduct) {
            $imeis = explode(',', $orderProduct->imei);

            for ($i=1; $i < $orderProduct->quantidade; $i++) {
                PedidoProduto::create([
                    'pedido_id'   => $orderProduct->pedido_id,
                    'produto_sku' => $orderProduct->produto_sku,
                    'valor'       => $orderProduct->valor,
                    'quantidade'  => 1,
                    'imei'        => $imeis[$i],
                ]);
            }

            $orderProduct->quantidade = 1;
            $orderProduct->imei = $imeis[0];
            $orderProduct->save();
        }

        $orderProductsWithoutImei = DB::table('pedido_produtos')
            ->whereNotNull('imei')
            ->get();

        foreach ($orderProductsWithoutImei as $orderProduct) {
            for ($i=1; $i < $orderProduct->quantidade; $i++) {
                PedidoProduto::create([
                    'pedido_id'   => $orderProduct->pedido_id,
                    'produto_sku' => $orderProduct->produto_sku,
                    'valor'       => $orderProduct->valor,
                    'quantidade'  => 1
                ]);
            }

            $orderProduct->quantidade = 1;
            $orderProduct->save();
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
