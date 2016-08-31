<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddFieldsToProdutosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('produtos', function(Blueprint $table)
        {
            $table->integer('referencia')->nullable()->after('ean');
            $table->char('unidade', 5)->nullable()->after('referencia');
            $table->boolean('controle_serial')->default(false)->after('unidade');
            $table->boolean('ativo')->default(true)->after('controle_serial');
            $table->integer('linha_id')->unsigned()->nullable()->after('sku');
            $table->integer('marca_id')->unsigned()->nullable()->after('sku');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('produtos', function (Blueprint $table) {
            $table->dropColumn('referencia');
            $table->dropColumn('unidade');
            $table->dropColumn('controle_serial');
            $table->dropColumn('ativo');
            $table->dropColumn('linha_id');
            $table->dropColumn('marca_id');
        });
    }
}
