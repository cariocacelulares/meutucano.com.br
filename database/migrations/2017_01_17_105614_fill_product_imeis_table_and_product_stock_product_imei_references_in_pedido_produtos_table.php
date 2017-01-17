<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Core\Models\Produto\ProductStock;
use Core\Models\Produto\ProductImei;

class FillProductImeisTableAndProductStockProductImeiReferencesInPedidoProdutosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        echo 'executing FillProductImeisTableAndProductStockProductImeiReferencesInPedidoProdutosTable ' . date('H:i:s') . PHP_EOL;

        $productStockIds = [];

        /* Pega todos os pedido_produtos com imei e exporta os imeis para a table product_imeis */
        $imeis = DB::table('pedido_produtos')
            ->whereNotNull('imei')
            ->get();

        $productImeis = [];
        $registeredImeis = [];
        foreach ($imeis as $orderProduct) {
            // Não deixa inserir duplicados (preserva unique)
            if (in_array($orderProduct->imei, $registeredImeis)) {
                continue;
            }

            if (!isset($productStockIds[$orderProduct->produto_sku])) {
                $productStock = ProductStock::firstOrCreate([
                    'product_sku' => $orderProduct->produto_sku,
                    'stock_slug'  => 'default',
                ]);

                $productStockIds[$orderProduct->produto_sku] = $productStock->id;
            }

            $productImeis[] = [
                'product_stock_id' => $productStockIds[$orderProduct->produto_sku],
                'imei'             => $orderProduct->imei,
            ];

            $registeredImeis[] = $orderProduct->imei;
        }

        ProductImei::insert($productImeis);
        /* Fim */

        echo 'imeis finished, creating relations ' . date('H:i:s') . PHP_EOL;

        /* Adiciona os ids das FKs de product_stock e product_imei no pedido_produtos */
        $pedidoProdutos = DB::table('pedido_produtos')
            ->get();

        $productImeiIds = [];
        foreach ($pedidoProdutos as $orderProduct) {
            if (!isset($productStockIds[$orderProduct->produto_sku])) {
                $productStock = ProductStock::firstOrCreate([
                    'product_sku' => $orderProduct->produto_sku,
                    'stock_slug'  => 'default',
                ]);

                $productStockIds[$orderProduct->produto_sku] = $productStock->id;
            }

            if ($orderProduct->imei) {
                if (!isset($productImeiIds[$orderProduct->imei])) {
                    $productImei = ProductImei::firstOrCreate([
                        'imei' => $orderProduct->imei,
                    ]);

                    $productImeiIds[$orderProduct->imei] = $productImei->id;
                }
            }

            DB::table('pedido_produtos')
                ->where('id', '=', $orderProduct->id)
                ->update([
                    'product_stock_id' => $productStockIds[$orderProduct->produto_sku],
                    'product_imei_id'  => $orderProduct->imei ? $productImeiIds[$orderProduct->imei] : null,
                ]);

        }
        /* Fim */

        echo 'finished ' . date('H:i:s') . PHP_EOL;
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
