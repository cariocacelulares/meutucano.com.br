<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddMetodoPagamentoAndFreteToPedidosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('pedidos', function (Blueprint $table) {
            $table->renameColumn('codigo_skyhub', 'codigo_api');
            $table->renameColumn('frete_skyhub', 'frete_valor');
            $table->string('frete_metodo', 30)->nullable()->after('frete_skyhub');
            $table->string('pagamento_metodo', 30)->nullable()->after('frete_metodo');
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
            $table->renameColumn('codigo_api', 'codigo_skyhub');
            $table->renameColumn('frete_valor', 'frete_skyhub');
            $table->dropColumn(['frete_metodo', 'pagamento_metodo']);
        });
    }
}
