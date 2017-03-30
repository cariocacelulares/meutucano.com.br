<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ClearInvalidImeisInPedidoProdutosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        echo 'executing ClearInvalidImeisInPedidoProdutosTable ' . date('H:i:s') . PHP_EOL;

        DB::table('pedido_produtos')
            ->whereIn('imei', ['MO', 'KB', 'NAO', ''])
            ->update([
                'imei' => null
            ]);

        echo 'finished ' . date('H:i:s') . PHP_EOL;;
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
