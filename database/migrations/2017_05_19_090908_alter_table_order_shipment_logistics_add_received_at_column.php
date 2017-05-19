<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterTableOrderShipmentLogisticsAddReceivedAtColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('order_shipment_logistics', function($table) {
            $table->timestamp('received_at')->nullable()->after('note');
        });

        \DB::table('order_shipment_logistics')->update(['received_at' => \DB::raw('updated_at')]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('order_shipment_logistics', function($table) {
            $table->dropColumn('received_at');
        });
    }
}
