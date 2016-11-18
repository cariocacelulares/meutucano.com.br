<?php

use App\Models\Cliente\Cliente;
use App\Models\Cliente\Endereco;
use App\Models\Pedido\Pedido;
use App\Models\Pedido\Imposto;
use App\Models\Pedido\Nota;
use App\Models\Pedido\Nota\Devolucao as NotaDevolucao;
use App\Models\Pedido\PedidoProduto;
use App\Models\Pedido\Rastreio;
use App\Models\Pedido\Rastreio\Devolucao;
use App\Models\Pedido\Rastreio\Logistica;
use App\Models\Pedido\Rastreio\Pi;

use App\Models\Inspecao\InspecaoTecnica;

use App\Models\Produto\Produto;
use App\Models\Pedido\Comentario;

use App\Models\Usuario\Usuario;
use App\Models\Usuario\Senha;

use Illuminate\Database\Eloquent\Model;

use App\Models\FaturamentoCodigo;

class TestSeeder extends \Illuminate\Database\Seeder {

  /**
   * Run seeder
   */
  public function run()
  {
    DB::statement('SET FOREIGN_KEY_CHECKS=0;');

    factory(Usuario::class, 5)
      ->create();

    factory(Senha::class, 10)
      ->create([
        'usuario_id' => Usuario::all()->random()->id
      ]);

    factory(\App\Models\Pedido\Nota\Devolucao::class, 5)->create([
      'usuario_id' => Usuario::first()->id,
      'nota_id'    => Nota::all()->random()->id
    ]);

    factory(InspecaoTecnica::class, 5)->create([
      'usuario_id' => Usuario::first()->id,
      'pedido_produtos_id' => PedidoProduto::all()->random()->id,
      'produto_sku' => Produto::all()->random()->sku,
    ]);

    factory(FaturamentoCodigo::class)->create([
      'servico' => 0
    ]);

    factory(FaturamentoCodigo::class)->create([
      'servico' => 1
    ]);

    DB::statement('SET FOREIGN_KEY_CHECKS=1;');
  }
}
