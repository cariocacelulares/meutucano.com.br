<?php namespace Modules\Core\Tests;

use Modules\Core\Models\Produto\Produto;

trait CreateProduto
{

  /**
   * Cria um objeto de produto
   *
   * @return Modules\Core\Models\Produto\Produto
   */
  public function createProduto($data = [])
  {
    return factory(Produto::class)->create($data);
  }

  /**
   * Cria um objeto de produto seminovo
   *
   * @return Modules\Core\Models\Produto\Produto
   */
  public function createProdutoSeminovo($data = [])
  {
    return factory(Produto::class)->create(array_merge($data, [
      'estado' => 1
    ]));
  }
}