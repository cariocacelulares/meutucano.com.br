<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterTableOrderProductsAddOrderInvoiceDevolutionId extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('order_products', function($table) {
            $table->unsignedInteger('order_invoice_devolution_id')->nullable()->after('product_serial_id');

            $table->foreign('order_invoice_devolution_id')
                ->references('id')
                ->on('order_invoice_devolutions')
                ->onDelete('set null');
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
