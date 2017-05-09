<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterProductsTablesToEnglish extends Migration
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
        Schema::rename('linhas', 'lines');
        Schema::table('lines', function(Blueprint $table) {
            $table->renameColumn('titulo', 'title');
            $table->renameColumn('ncm_padrao', 'ncm_default');
        });

        /**
        * Brands
        */
        Schema::rename('marcas', 'brands');
        Schema::table('brands', function(Blueprint $table) {
            $table->renameColumn('titulo', 'title');
        });

        /**
        * Products
        */
        Schema::rename('produtos', 'products');
        Schema::table('products', function(Blueprint $table) {
            $table->dropForeign('ProdutoLinhaProduto');
            $table->dropForeign('ProdutoMarcaProduto');
        });
        Schema::table('products', function(Blueprint $table) {
            $table->renameColumn('marca_id', 'brand_id');
            $table->renameColumn('linha_id', 'line_id');
            $table->renameColumn('titulo', 'title');
            $table->renameColumn('valor', 'price');
            $table->renameColumn('estado', 'condition');

            $table->foreign('brand_id')
                ->references('id')
                ->on('brands')
                ->onUpdate('CASCADE')
                ->onDelete('set null');

            $table->foreign('line_id')
                ->references('id')
                ->on('lines')
                ->onUpdate('CASCADE')
                ->onDelete('set null');
        });

        /**
        * Product Serials
        */
        Schema::rename('product_imeis', 'product_serials');
        Schema::table('product_serials', function(Blueprint $table) {
            $table->dropForeign('ProductImeisProductStockId');
        });
        Schema::table('product_serials', function(Blueprint $table) {
            $table->renameColumn('imei', 'serial');
            $table->renameColumn('product_stock_id', 'depot_product_id');

            $table->foreign('depot_product_id')
                ->references('id')
                ->on('depot_products')
                ->onUpdate('CASCADE')
                ->onDelete('CASCADE');
        });

        Schema::table('depot_entry_product_serials', function(Blueprint $table) {
            $table->dropForeign('StockEntryProductImeisProductImei');
        });
        Schema::table('depot_entry_product_serials', function(Blueprint $table) {
            $table->renameColumn('product_imei_id', 'product_serial_id');

            $table->foreign('product_serial_id')
                ->references('id')
                ->on('product_serials')
                ->onUpdate('CASCADE')
                ->onDelete('CASCADE');
        });

        /**
        * Depot issues
        */
        Schema::table('product_serial_issues', function(Blueprint $table) {
            $table->dropForeign('StockIssuesProductImeis');
        });
        Schema::table('product_serial_issues', function(Blueprint $table) {
            $table->renameColumn('product_imei_id', 'product_serial_id');

            $table->foreign('product_serial_id')
                ->references('id')
                ->on('product_serials')
                ->onUpdate('CASCADE')
                ->onDelete('CASCADE');
        });

        /**
        * Depot withdraws
        */
        Schema::table('depot_withdraw_products', function(Blueprint $table) {
            $table->dropForeign('StockRemovalProductsProductImeis');
        });
        Schema::table('depot_withdraw_products', function(Blueprint $table) {
            $table->renameColumn('product_imei_id', 'product_serial_id');

            $table->foreign('product_serial_id')
                ->references('id')
                ->on('product_serials')
                ->onUpdate('CASCADE')
                ->onDelete('set null');
        });

        /**
        * Product Defects
        */
        Schema::table('product_defects', function(Blueprint $table) {
            $table->dropForeign('ProductDefectsProductImeisId');
        });
        Schema::table('product_defects', function(Blueprint $table) {
            $table->renameColumn('product_imei_id', 'product_serial_id');

            $table->foreign('product_serial_id')
                ->references('id')
                ->on('product_serials')
                ->onUpdate('CASCADE')
                ->onDelete('CASCADE');
        });

        /**
        * Order Products
        */
        Schema::rename('pedido_produtos', 'order_products');
        Schema::table('order_products', function(Blueprint $table) {
            $table->dropForeign('PedidoProdutoPedido');
            $table->dropForeign('PedidoProdutoProductStockId');
            $table->dropForeign('PedidoProdutoProductImeiId');
            $table->dropForeign('PedidoProdutoProduto');
        });
        Schema::table('order_products', function(Blueprint $table) {
            $table->renameColumn('pedido_id', 'order_id');
            $table->renameColumn('produto_sku', 'product_sku');
            $table->renameColumn('product_stock_id', 'depot_product_id');
            $table->renameColumn('product_imei_id', 'product_serial_id');
            $table->renameColumn('valor', 'price');

            $table->foreign('order_id')
                ->references('id')
                ->on('orders')
                ->onUpdate('CASCADE')
                ->onDelete('CASCADE');

            $table->foreign('product_sku')
                ->references('sku')
                ->on('products')
                ->onUpdate('CASCADE')
                ->onDelete('RESTRICT');

            $table->foreign('depot_product_id')
                ->references('id')
                ->on('depot_products')
                ->onUpdate('CASCADE')
                ->onDelete('set null');

            $table->foreign('product_serial_id')
                ->references('id')
                ->on('product_serials')
                ->onUpdate('CASCADE')
                ->onDelete('set null');
        });

        Schema::enableForeignKeyConstraints();
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
