<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStockRemovalsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
		Schema::create('stock_removals', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('user_id')->unsigned()->nullable()->index();
			$table->boolean('is_continuous')->default(false);
			$table->dateTime('closed_at')->nullable();
			$table->timestamps();
		});

        Schema::table('stock_removals', function ($table) {
            $table
                ->foreign('user_id', 'StockRemovalsUsers')
                ->references('id')
                ->on('usuarios')
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
		Schema::drop('stock_removals');
    }
}
