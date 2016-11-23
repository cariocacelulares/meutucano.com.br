<?php namespace Modules\InspecaoTecnica\Tests;

use Modules\InspecaoTecnica\Models\InspecaoTecnica;
use App\Models\Produto\Produto;
use Tests\CreatePedido;
use Tests\CreateUsuario;

trait CreateInspecao
{
  use CreatePedido,
    CreateUsuario;

  /**
   * Cria um novo objeto de inspeção
   *
   * @return App\Models\Inspecao\InspecaoTecnica
   */
  public function createInspecao($data = [])
  {
    $pedido = $this->createPedido();

    return factory(InspecaoTecnica::class)->create(array_merge($data, [
      'usuario_id'         => $this->createUsuario()->id,
      'pedido_produtos_id' => $pedido->produtos()->first()->id,
      'produto_sku'        => $pedido->produtos()->first()->produto->sku,
    ]));
  }

  /**
   * Cria um novo objeto de inspeção sem relação com pedido
   *
   * @return App\Models\Inspecao\InspecaoTecnica
   */
  public function createInspecaoWithNoAssociation($data = [])
  {
    return factory(InspecaoTecnica::class)->create(array_merge($data, [
      'usuario_id' => $this->createUsuario()->id
    ]));
  }
}