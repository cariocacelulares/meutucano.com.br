<?php

use App\Models\Cliente\Cliente;
use App\Models\Cliente\Endereco;
use App\Models\Pedido\Pedido;
use App\Models\Pedido\Imposto;
use App\Models\Pedido\Nota;
use App\Models\Pedido\PedidoProduto;
use App\Models\Pedido\Rastreio;
use App\Models\Produto\Produto;

class TestSeeder extends \Illuminate\Database\Seeder {

    /**
     * Run seeder
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');



        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}