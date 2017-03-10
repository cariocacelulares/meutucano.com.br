<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProductTitleVariationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('product_title_variations', function (Blueprint $table) {
            $table->increments('id');
            $table->string('title', 100);
            $table->string('ean', 20)->nullable();
            $table->string('ncm', 20)->nullable();
            $table->unsignedInteger('product_sku')->index();

            $table
                ->foreign('product_sku', 'ProductTitleVariationsProduct')
                ->references('sku')
                ->on('produtos')
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
        Schema::dropIfExists('product_title_variations');
    }
}
