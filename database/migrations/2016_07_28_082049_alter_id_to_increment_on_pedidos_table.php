<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterIdToIncrementOnPedidosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::update("SET FOREIGN_KEY_CHECKS = 0;");

        Schema::table('pedidos', function (Blueprint $table) {
            $table->increments('id')->change();
        });

        DB::update("SET FOREIGN_KEY_CHECKS = 1;");
        DB::update("ALTER TABLE pedidos AUTO_INCREMENT = 200000000;");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // DB::update("SET FOREIGN_KEY_CHECKS = 0;");

        // Schema::table('pedidos', function (Blueprint $table) {
        //     $table->dropPrimary('id');
        //     $table->integer('id')->unsigned()->change();
        // });

        // DB::update("SET FOREIGN_KEY_CHECKS = 1;");
    }
}
