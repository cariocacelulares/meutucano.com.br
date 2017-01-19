<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddForeignKeysToPedidoLigacoesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('pedido_ligacoes', function(Blueprint $table)
        {
            $table->foreign('pedido_id', 'PedidoLigacoesPedido')->references('id')->on('pedidos')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign('usuario_id', 'PedidoLigacoesUsuario')->references('id')->on('usuarios')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
		Schema::table('pedido_ligacoes', function(Blueprint $table)
		{
			$table->dropForeign('PedidoLigacoesPedido');
			$table->dropForeign('PedidoLigacoesUsuario');
		});
    }
}
