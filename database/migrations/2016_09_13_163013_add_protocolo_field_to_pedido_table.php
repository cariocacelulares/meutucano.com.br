<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use App\Models\Pedido\Pedido;
use App\Models\Pedido\Rastreio;
use App\Models\Pedido\Rastreio\Devolucao;
use App\Models\Pedido\Rastreio\Pi;
use App\Models\Pedido\Rastreio\Logistica;

class AddProtocoloFieldToPedidoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('pedidos', function (Blueprint $table) {
            $table->integer('protocolo')->nullable()->after('status');
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
            $table->dropColumn('protocolo');
        });
    }
}
