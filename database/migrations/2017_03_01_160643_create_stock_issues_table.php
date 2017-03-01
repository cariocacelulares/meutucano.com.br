<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStockIssuesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
		Schema::create('stock_issues', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('user_id')->unsigned()->index()->nullable();
			$table->integer('product_imei_id')->unsigned()->index();
            $table->string('reason', 100);
			$table->text('description', 65535);
			$table->timestamps();
		});

        Schema::table('stock_issues', function ($table) {
            $table
                ->foreign('user_id', 'StockIssuesUsers')
                ->references('id')
                ->on('usuarios')
                ->onDelete('CASCADE')
                ->onUpdate('CASCADE');

            $table
                ->foreign('product_imei_id', 'StockIssuesProductImeis')
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
		Schema::drop('stock_issues');
    }
}
