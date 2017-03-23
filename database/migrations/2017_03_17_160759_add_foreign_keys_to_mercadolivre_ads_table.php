<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddForeignKeysToMercadolivreAdsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
     public function up()
     {
         Schema::table('mercadolivre_ads', function(Blueprint $table)
         {
             $table->foreign('product_sku', 'MercadolivreAdProduct')->references('sku')->on('produtos')->onUpdate('CASCADE')->onDelete('CASCADE');
             $table->foreign('template_id', 'MercadolivreAdTemplate')->references('id')->on('mercadolivre_templates')->onUpdate('CASCADE')->onDelete('CASCADE');
         });
     }

     /**
      * Reverse the migrations.
      *
      * @return void
      */
     public function down()
     {
 		Schema::table('mercadolivre_ads', function(Blueprint $table)
 		{
 			$table->dropForeign('MercadolivreAdProduct');
 			$table->dropForeign('MercadolivreAdTemplate');
 		});
     }
}
