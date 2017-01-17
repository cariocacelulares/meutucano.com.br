<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Core\Models\Pedido\PedidoProduto;

class SplitPedidosProdutosRowsWithQuantityGreaterThanOne extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        echo 'executing SplitPedidosProdutosRowsWithQuantityGreaterThanOne ' . date('H:i:s') . PHP_EOL;

        $orderProductsWithoutImei = DB::table('pedido_produtos')
            ->where('quantidade', '>', 1)
            ->get();

        $pedidosProduto = [];
        foreach ($orderProductsWithoutImei as $orderProduct) {
            for ($i=1; $i < $orderProduct->quantidade; $i++) {
                $pedidosProduto[] = [
                    'pedido_id'   => $orderProduct->pedido_id,
                    'produto_sku' => $orderProduct->produto_sku,
                    'valor'       => $orderProduct->valor,
                    'quantidade'  => 1
                ];
            }

            if ($orderProduct = PedidoProduto::find($orderProduct->id)) {
                $orderProduct->quantidade = 1;
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
