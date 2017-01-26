<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class PassSerialEnabledFieldToProductStocksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
		Schema::table('product_stocks', function(Blueprint $table) {
            $table->boolean('serial_enabled')->default(false)->after('quantity');
        });

        Schema::table('produtos', function (Blueprint $table) {
            $table->dropColumn('controle_serial');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
		Schema::table('produtos', function(Blueprint $table) {
            $table->boolean('controle_serial')->default(false);
        });

        Schema::table('product_stocks', function (Blueprint $table) {
            $table->dropColumn('serial_enabled');
        });
    }
}
