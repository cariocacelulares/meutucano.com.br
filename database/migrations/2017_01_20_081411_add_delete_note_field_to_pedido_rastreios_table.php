<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddDeleteNoteFieldToPedidoRastreiosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
		Schema::table('pedido_rastreios', function(Blueprint $table)
        {
            $table->string('delete_note', 250)->after('imagem_historico')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('pedido_rastreios', function (Blueprint $table) {
            $table->dropColumn('delete_note');
        });
    }
}
