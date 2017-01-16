<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProductDefectsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('product_defects', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('product_imei_id');
            $table->string('description', 500);
			$table->timestamps();

            $table
                ->foreign('product_imei_id', 'ProductDefectsProductImeisId')
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
        Schema::dropIfExists('product_defects');
    }
}
