<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddCostFieldToProductImeisTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
		Schema::table('product_imeis', function(Blueprint $table)
        {
            $table->decimal('cost', 10)->after('imei')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('product_imeis', function (Blueprint $table) {
            $table->dropColumn('cost');
        });
    }
}
