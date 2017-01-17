<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddForeignKeysAndDropOldColumsInPedidoProdutosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        echo 'executing AddForeignKeysAndDropOldColumsInPedidoProdutosTable ' . date('H:i:s') . PHP_EOL;

        Schema::table('pedido_produtos', function ($table) {
            $table->dropColumn(['quantidade', 'imei']);

            $table
                ->foreign('product_imei_id', 'PedidoProdutoProductImeiId')
                ->references('id')
                ->on('product_imeis')
                ->onDelete('NO ACTION')
                ->onUpdate('CASCADE');

            $table
                ->foreign('product_stock_id', 'PedidoProdutoProductStockId')
                ->references('id')
                ->on('product_stocks')
                ->onDelete('NO ACTION')
                ->onUpdate('CASCADE');
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
            $table->decimal('valor', 10);
            $table->integer('quantidade')->unsigned()->default(1);

			$table->dropForeign('PedidoProdutoProductImeiId');
			$table->dropForeign('PedidoProdutoProductStockId');
        });
    }
}
