<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DropObservationFieldFromPedidoRastreiosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('pedido_rastreios', function (Blueprint $table)
        {
            $table->dropColumn('observacao');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('pedido_rastreios', function(Blueprint $table)
        {
            $table->string('observacao', 250)->nullable();
        });
    }
}
