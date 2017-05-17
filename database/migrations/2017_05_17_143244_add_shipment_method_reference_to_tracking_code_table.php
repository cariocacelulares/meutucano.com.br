<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddShipmentMethodReferenceToTrackingCodeTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tracking_codes', function($table) {
            $table->renameColumn('carrier', 'shipment_method_slug');
        });

        Schema::table('tracking_codes', function($table) {
            $table->string('shipment_method_slug', 100)->change();
        });

        \DB::table('tracking_codes')->where('shipment_method_slug', 0)->update(['shipment_method_slug' => 'correios-pac']);
        \DB::table('tracking_codes')->where('shipment_method_slug', 1)->update(['shipment_method_slug' => 'correios-sedex']);
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
