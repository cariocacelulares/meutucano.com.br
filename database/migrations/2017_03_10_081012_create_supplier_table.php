<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSupplierTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('suppliers', function (Blueprint $table) {
            $table->increments('id');
            $table->string('company_name', 100);
            $table->string('name', 100);
            $table->string('cnpj', 20);
            $table->string('ie', 20)->nullable();
            $table->tinyInteger('crt')->unsigned();
            $table->string('fone', 100);
            $table->string('street', 100);
            $table->string('number', 20)->default('s/n');
            $table->string('complement', 100);
            $table->string('neighborhood', 20);
            $table->string('city', 30);
            $table->string('uf', 3);
            $table->string('cep', 10);
            $table->string('country', 20);
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
        Schema::dropIfExists('suppliers');
    }
}
