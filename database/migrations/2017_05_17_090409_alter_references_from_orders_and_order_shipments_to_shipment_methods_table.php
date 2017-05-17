<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterReferencesFromOrdersAndOrderShipmentsToShipmentMethodsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        \DB::table('orders')->where('shipment_method', 'pac')
            ->orWhereNull('shipment_method')
            ->update(['shipment_method' => 'correios-pac']);

        \DB::table('orders')->where('shipment_method', 'sedex')
            ->update(['shipment_method' => 'correios-sedex']);

        \DB::table('orders')->where('shipment_method', 'outro')
            ->update(['shipment_method' => 'withdraw']);

        \DB::table('orders')->whereNull('shipment_method')
            ->update(['shipment_method' => 'correios-sedex']);

        \DB::table('order_shipments')->where('carrier', 'pac')
            ->orWhereNull('carrier')
            ->update(['carrier' => 'correios-pac']);

        \DB::table('order_shipments')->where('carrier', 'sedex')
            ->update(['carrier' => 'correios-sedex']);

        \DB::table('order_shipments')->where('carrier', 'outro')
            ->update(['carrier' => 'correios-pac']);

        \DB::table('order_shipments')->whereNull('carrier')
            ->update(['carrier' => 'correios-sedex']);

        Schema::table('orders', function($table) {
            $table->string('shipment_method', 100)->nullable()->change();
        });

        Schema::table('orders', function($table) {
            $table->renameColumn('shipment_method', 'shipment_method_slug');
        });

        Schema::table('orders', function($table) {
            $table
                ->foreign('shipment_method_slug')
                ->references('slug')
                ->on('shipment_methods')
                ->onDelete('SET NULL')
                ->onUpdate('CASCADE');
        });

        Schema::table('order_shipments', function($table) {
            $table->string('carrier', 100)->nullable()->change();
        });

        Schema::table('order_shipments', function($table) {
            $table->renameColumn('carrier', 'shipment_method_slug');
        });

        Schema::table('order_shipments', function($table) {
            $table
                ->foreign('shipment_method_slug')
                ->references('slug')
                ->on('shipment_methods')
                ->onDelete('SET NULL')
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
        //
    }
}
