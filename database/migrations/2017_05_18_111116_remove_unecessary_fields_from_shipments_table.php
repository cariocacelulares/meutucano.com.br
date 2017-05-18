<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RemoveUnecessaryFieldsFromShipmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('order_shipment_devolutions', function($table) {
            $table->dropColumn('action');
        });

        Schema::table('order_shipment_issues', function($table) {
            $table->dropColumn('action');
        });

        Schema::table('order_shipment_logistics', function($table) {
            $table->dropColumn('action');
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
