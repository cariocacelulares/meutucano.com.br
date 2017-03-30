<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Core\Models\Pedido\PedidoProduto;

class SplitPedidoProdutosRowsWithImei extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        echo 'executing SplitPedidoProdutosRowsWithImei ' . date('H:i:s') . PHP_EOL;

        $orderProductsWithImei = DB::table('pedido_produtos')
            ->whereNotNull('imei')
            ->where('imei', 'LIKE', '%,%')
            ->get();

        $pedidosProduto = [];
        foreach ($orderProductsWithImei as $orderProduct) {
            $imeis = explode(',', $orderProduct->imei);

            for ($i=1; $i < $orderProduct->quantidade; $i++) {
                $pedidosProduto[] = [
                    'pedido_id'   => $orderProduct->pedido_id,
                    'produto_sku' => $orderProduct->produto_sku,
                    'valor'       => $orderProduct->valor,
                    'quantidade'  => 1,
                    'imei'        => isset($imeis[$i]) ? trim($imeis[$i]) : null,
                ];
            }

            if ($orderProduct = PedidoProduto::find($orderProduct->id)) {
                $orderProduct->quantidade = 1;
                $orderProduct->imei = $imeis[0];
                $orderProduct->save();
            }
        }

        PedidoProduto::insert($pedidosProduto);

        echo 'finished ' . date('H:i:s') . PHP_EOL;
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Sem necessidade
    }
}
