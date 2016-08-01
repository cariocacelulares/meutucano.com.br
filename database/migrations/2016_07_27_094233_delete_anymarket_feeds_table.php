<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DeleteAnymarketFeedsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::drop('anymarket_feeds');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::create('anymarket_feeds', function(Blueprint $table)
        {
            $table->increments('id');
            $table->integer('tipo')->unsigned();
            $table->timestamps();
        });
    }
}
