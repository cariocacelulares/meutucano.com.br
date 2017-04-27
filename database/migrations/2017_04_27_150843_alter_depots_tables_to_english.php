<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterDepotsTablesToEnglish extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::disableForeignKeyConstraints();

        /**
         * Lines
         */
        Schema::rename('stocks', 'depots');
        Schema::rename('stock_removals', 'depot_withdraws');
        Schema::rename('stock_removal_products', 'depot_withdraw_products');
        Schema::rename('stock_issues', 'depot_issues');
        Schema::rename('stock_entry_products', 'depot_entry_products');
        Schema::rename('stock_entry_product_imeis', 'depot_entry_product_serials');
        Schema::rename('stock_entry_invoices', 'depot_entry_invoices');
        Schema::rename('stock_entries', 'depot_entries');
        Schema::rename('product_stocks', 'depot_products');

        /**
        * Depot products
        */
        Schema::table('depot_products', function(Blueprint $table) {
            $table->dropForeign('ProductStockStockSlug');
        });
        Schema::table('depot_products', function(Blueprint $table) {
            $table->renameColumn('stock_slug', 'depot_slug');

            $table->foreign('depot_slug')
                ->references('slug')
                ->on('depots')
                ->onDelete('CASCADE');
        });

        /**
        * Depot withdraw products
        */
        Schema::table('depot_withdraw_products', function(Blueprint $table) {
            $table->dropForeign('StockRemovalProductsProductStocks');
            $table->dropForeign('StockRemovalProductsStockRemovals');
        });
        Schema::table('depot_withdraw_products', function(Blueprint $table) {
            $table->renameColumn('product_stock_id', 'depot_product_id');
            $table->renameColumn('stock_removal_id', 'depot_withdraw_id');

            $table->foreign('depot_product_id')
                ->references('id')
                ->on('depot_products')
                ->onDelete('CASCADE');

            $table->foreign('depot_withdraw_id')
                ->references('id')
                ->on('depot_withdraws')
                ->onDelete('CASCADE');
        });

        /**
        * Depot entry invoices
        */
        Schema::table('depot_entry_invoices', function(Blueprint $table) {
            $table->dropForeign('StockEntryInvoicesStockEntry');
        });
        Schema::table('depot_entry_invoices', function(Blueprint $table) {
            $table->renameColumn('stock_entry_id', 'depot_entry_id');

            $table->foreign('depot_entry_id')
                ->references('id')
                ->on('depot_entries')
                ->onDelete('CASCADE');
        });

        /**
        * Depot entry products
        */
        Schema::table('depot_entry_products', function(Blueprint $table) {
            $table->dropForeign('StockEntryProductsProductStock');
            $table->dropForeign('StockEntryProductsStockEntry');
        });
        Schema::table('depot_entry_products', function(Blueprint $table) {
            $table->renameColumn('product_stock_id', 'depot_product_id');
            $table->renameColumn('stock_entry_id', 'depot_entry_id');
            $table->renameColumn('imeis', 'serials');

            $table->foreign('depot_product_id')
                ->references('id')
                ->on('depot_products')
                ->onDelete('CASCADE');

            $table->foreign('depot_entry_id')
                ->references('id')
                ->on('depot_entries')
                ->onDelete('CASCADE');
        });

        /**
        * Depot entry product serials
        */
        Schema::table('depot_entry_product_serials', function(Blueprint $table) {
            $table->dropForeign('StockEntryProductImeisProductId');
        });
        Schema::table('depot_entry_product_serials', function(Blueprint $table) {
            $table->renameColumn('stock_entry_product_id', 'depot_entry_product_id');

            $table->foreign('depot_entry_product_id')
                ->references('id')
                ->on('depot_entry_products')
                ->onDelete('CASCADE');
        });
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
