<?php namespace Tests;

use App\Models\Produto\Produto;

trait CreateProduto
{

  /**
   * Cria um objeto de produto
   *
   * @return App\Models\Produto\Produto
   */
  public function createProduto($data = [])
  {
    return factory(Produto::class)->create($data);
  }

  /**
   * Cria um objeto de produto seminovo
   *
   * @return App\Models\Produto\Produto
   */
  public function createProdutoSeminovo($data = [])
  {
    return factory(Produto::class)->create(array_merge($data, [
      'estado' => 1
    ]));
  }
}