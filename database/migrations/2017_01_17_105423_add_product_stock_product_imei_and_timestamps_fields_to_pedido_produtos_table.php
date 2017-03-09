<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddProductStockProductImeiAndTimestampsFieldsToPedidoProdutosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        echo 'executing AddProductStockProductImeiAndTimestampsFieldsToPedidoProdutosTable ' . date('H:i:s') . PHP_EOL;

        Schema::table('pedido_produtos', function ($table) {
            $table->unsignedInteger('product_stock_id')->nullable()->after('produto_sku');
            $table->unsignedInteger('product_imei_id')->nullable()->default(null)->after('product_stock_id');
            $table->timestamps();
        });

        echo 'finished ' . date('H:i:s') . PHP_EOL;
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('pedido_produtos', function ($table) {
            $table->dropColumn([
                'product_imei_id',
                'product_stock_id',
                'created_at',
                'updated_at',
            ]);
        });
    }
}
