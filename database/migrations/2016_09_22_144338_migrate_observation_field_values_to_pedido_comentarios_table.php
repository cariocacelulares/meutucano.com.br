<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use App\Models\Pedido\Rastreio;
use App\Models\Pedido\Pedido;
use App\Models\Pedido\Comentario;

class MigrateObservationFieldValuesToPedidoComentariosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('pedido_comentarios', function(Blueprint $table)
        {
            $table->integer('usuario_id')->unsigned()->nullable()->change();
        });

        $rastreios = Rastreio::whereNotNull('observacao')->get();
        foreach ($rastreios as $rastreio) {
            $comentario = new Comentario();
            $comentario->pedido_id = $rastreio->pedido_id;
            $comentario->comentario = $rastreio->observacao;
            $comentario->save();
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        $comentarios = App\Models\Pedido\Comentario::all();
        foreach ($comentarios as $comentario) {
            if ($pedido = Pedido::find($comentario->pedido_id)) {
                if ($rastreio = $pedido->rastreios()->first()) {
                    $rastreio->observacao = $comentario->comentario;
                    $rastreio->save();
                }
            }
        }
    }
}
