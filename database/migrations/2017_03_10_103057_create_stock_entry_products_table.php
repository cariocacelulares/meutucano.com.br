<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStockEntryProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('stock_entry_products', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('stock_entry_id')->index();
            $table->unsignedInteger('product_sku')->index();
            $table->unsignedInteger('product_stock_id')->index();
            $table->unsignedInteger('product_title_variation_id')->index();
            $table->double('quantity');
			$table->decimal('unitary_value', 10);
			$table->decimal('total_value', 10);
			$table->decimal('icms', 10)->nullable();
            $table->decimal('ipi', 10)->nullable();
			$table->decimal('pis', 10)->nullable();
			$table->decimal('cofins', 10)->nullable();
			$table->timestamps();

            $table
                ->foreign('stock_entry_id', 'StockEntryProductsStockEntry')
                ->references('id')
                ->on('stock_entries')
                ->onDelete('CASCADE')
                ->onUpdate('CASCADE');

            $table
                ->foreign('product_sku', 'StockEntryProductsProduct')
                ->references('sku')
                ->on('produtos')
                ->onDelete('NO ACTION')
                ->onUpdate('CASCADE');

            $table
                ->foreign('product_stock_id', 'StockEntryProductsProductStock')
                ->references('id')
                ->on('product_stocks')
                ->onDelete('NO ACTION')
                ->onUpdate('CASCADE');

            $table
                ->foreign('product_title_variation_id', 'StockEntryProductsProductTitleVariations')
                ->references('id')
                ->on('product_title_variations')
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
        Schema::dropIfExists('stock_entry_products');
    }
}
