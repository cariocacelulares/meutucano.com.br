<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOrderShipmentHistoryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('order_shipment_history', function($table) {
            $table->increments('id');
            $table->unsignedInteger('order_shipment_id');
            $table->tinyInteger('status');
            $table->timestamp('date');
            $table->string('location', 100);
            $table->string('zipcode', 20);
            $table->string('action');
            $table->string('detail')->nullable();

            $table->foreign('order_shipment_id')
                ->references('id')
                ->on('order_shipments')
                ->onUpdate('CASCADE')
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
        Schema::drop('order_shipment_history');
    }
}
