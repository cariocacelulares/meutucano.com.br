<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProductImeisTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('product_imeis', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('product_stock_id');
            $table->string('imei', 40)->unique();
			$table->timestamps();

            $table
                ->foreign('product_stock_id', 'ProductImeisProductStockId')
                ->references('id')
                ->on('product_stocks')
                ->onDelete('NO ACTION')
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
        Schema::dropIfExists('product_imeis');
    }
}
