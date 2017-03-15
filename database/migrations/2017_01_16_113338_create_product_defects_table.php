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
            $table->integer('product_sku')->unsigned()->index();;
            $table->integer('product_imei_id')->unsigned()->index();;
            $table->string('description', 500);
			$table->timestamps();

            $table
                ->foreign('product_sku', 'ProductDefectsProductSku')
                ->references('sku')
                ->on('produtos')
                ->onDelete('NO ACTION')
                ->onUpdate('CASCADE');

            $table
                ->foreign('product_imei_id', 'ProductDefectsProductImeisId')
                ->references('id')
                ->on('product_imeis')
                ->onDelete('CASCADE')
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
