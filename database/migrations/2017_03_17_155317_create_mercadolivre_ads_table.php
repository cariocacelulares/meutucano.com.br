<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMercadolivreAdsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('mercadolivre_ads', function(Blueprint $table) {
            $table->increments('id');
            $table->integer('product_sku')->unsigned()->index();
            $table->integer('template_id')->unsigned()->index()->nullable();
            $table->string('code', 20)->nullable()->unique();
            $table->string('permalink', 255)->nullable();
            $table->string('title')->nullable();
            $table->string('video', 30)->nullable();
            $table->decimal('price', 10, 2);
            $table->string('category_id', 30);
            $table->tinyInteger('type')->default(0);
            $table->tinyInteger('shipping')->default(0);
            $table->text('template_custom')->nullable();
            $table->tinyInteger('status')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('mercadolivre_ads');
    }
}
