<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use App\Models\Produto\Produto;

class UpdateSeminovosEstadoInProdutosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $produtos = Produto::where('titulo', 'LIKE', '%seminovo%')->orWhere('titulo', 'LIKE', '%vitrine%')->get();
        foreach ($produtos as $produto) {
            $produto->estado = 1;
            $produto->save();
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        $produtos = Produto::where('estado', '=', 1)->get();
        foreach ($produtos as $produto) {
            $produto->estado = 0;
            $produto->save();
        }
    }
}
