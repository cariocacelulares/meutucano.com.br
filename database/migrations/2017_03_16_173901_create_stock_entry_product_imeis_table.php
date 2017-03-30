<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStockEntryProductImeisTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('stock_entry_product_imeis', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('stock_entry_product_id')->index();
            $table->unsignedInteger('product_imei_id')->index();
			$table->timestamps();

            $table
                ->foreign('stock_entry_product_id', 'StockEntryProductImeisProductId')
                ->references('id')
                ->on('stock_entry_products')
                ->onDelete('CASCADE')
                ->onUpdate('CASCADE');

            $table
                ->foreign('product_imei_id', 'StockEntryProductImeisProductImei')
                ->references('id')
                ->on('product_imeis')
                ->onDelete('CASCADE')
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
        Schema::dropIfExists('stock_entry_product_imeis');
    }
}
