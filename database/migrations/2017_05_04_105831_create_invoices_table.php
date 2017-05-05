<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateInvoicesTable extends Migration
{
    /**
     * @return void
     */
     public function up()
 	{
 		Schema::create('invoices', function(Blueprint $table)
 		{
 			$table->increments('id');
 			$table->unsignedInteger('invoiceable_id');
 			$table->string('invoiceable_type');
 			$table->unsignedInteger('number');
 			$table->tinyInteger('series')->unsigned();
            $table->unsignedInteger('cfop')->nullable();
 			$table->string('key', 50);
 			$table->date('issued_at');
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
 		Schema::drop('invoices');
 	}
}
