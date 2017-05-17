<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddIdAsPrimaryToTrackingCodesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        \DB::unprepared('ALTER TABLE `tracking_codes` DROP PRIMARY KEY');

        Schema::table('tracking_codes', function($table) {
            $table->increments('id')->first();
            $table->timestamps();

            $table
                ->foreign('shipment_method_slug')
                ->references('slug')
                ->on('shipment_methods')
                ->onDelete('CASCADE')
                ->onUpdate('CASCADE');
        });

        \DB::table('tracking_codes')->update([
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ]);
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
