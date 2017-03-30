<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStockEntryInvoicesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('stock_entry_invoices', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('stock_entry_id')->index();
            $table->string('key', 50)->unique();
            $table->string('series', 4);
            $table->string('number', 10);
            $table->string('model', 10)->nullable();
            $table->string('cfop', 4);
			$table->decimal('total', 10);
            $table->string('file', 250)->nullable();
            $table->timestamp('emission');
			$table->timestamps();

            $table
                ->foreign('stock_entry_id', 'StockEntryInvoicesStockEntry')
                ->references('id')
                ->on('stock_entries')
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
        Schema::dropIfExists('stock_entry_invoices');
    }
}
