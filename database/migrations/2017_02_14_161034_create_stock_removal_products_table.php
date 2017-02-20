<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStockRemovalProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
		Schema::create('stock_removal_products', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('stock_removal_id')->unsigned()->index();
			$table->integer('product_stock_id')->unsigned()->index();
			$table->integer('product_imei_id')->unsigned()->nullable()->index();
			$table->tinyInteger('status')->default(0);
		});

        Schema::table('stock_removal_products', function ($table) {
            $table
                ->foreign('stock_removal_id', 'StockRemovalProductsStockRemovals')
                ->references('id')
                ->on('stock_removals')
                ->onDelete('CASCADE')
                ->onUpdate('CASCADE');

            $table
                ->foreign('product_stock_id', 'StockRemovalProductsProductStocks')
                ->references('id')
                ->on('product_stocks')
                ->onDelete('NO ACTION')
                ->onUpdate('CASCADE');

            $table
                ->foreign('product_imei_id', 'StockRemovalProductsProductImeis')
                ->references('id')
                ->on('product_imeis')
                ->onDelete('NO ACTION')
                ->onUpdate('CASCADE');
		});
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('stock_removal_products', function ($table) {
			$table->dropForeign('StockRemovalProductsStockRemovals');
			$table->dropForeign('StockRemovalProductsProductStocks');
			$table->dropForeign('StockRemovalProductsProductImeis');
        });

		Schema::drop('stock_removal_products');
    }
}
