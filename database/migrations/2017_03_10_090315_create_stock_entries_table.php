<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStockEntriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('stock_entries', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('user_id')->index();
            $table->unsignedInteger('supplier_id')->index();
            $table->string('confirmed_at')->dateTime();
            $table->softDeletes();
			$table->timestamps();

            $table
                ->foreign('user_id', 'StockEntryUsuarios')
                ->references('id')
                ->on('usuarios')
                ->onDelete('NO ACTION')
                ->onUpdate('CASCADE');

            $table
                ->foreign('supplier_id', 'StockEntrySupplier')
                ->references('id')
                ->on('suppliers')
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
        Schema::dropIfExists('stock_entries');
    }
}
