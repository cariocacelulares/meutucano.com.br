<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddAnymarketColumnsToPedidosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('pedidos', function (Blueprint $table) {
            $table->integer('codigo_anymarket')->nullable()->unsigned()->after('cliente_endereco_id');
            $table->decimal('frete_anymarket', 10)->nullable()->after('codigo_anymarket');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('pedidos', function (Blueprint $table) {
            $table->dropColumn('codigo_anymarket');
            $table->dropColumn('frete_anymarket');
        });
    }
}
