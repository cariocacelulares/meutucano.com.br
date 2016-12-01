<?php namespace Tests\InspecaoTecnica;

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use InspecaoTecnica\Models\InspecaoTecnica;
use Tests\TestCase;

class InspecaoTecnicaTest extends TestCase
{
  use WithoutMiddleware,
    DatabaseMigrations,
    DatabaseTransactions,
    CreateInspecao;

  /**
   * Testa se é possível definir uma inspeção como proriodade
   *
   * @return void
   */
  public function test__it_should_be_able_to_change_priority()
  {
    $inspecao = $this->createInspecao();

    $this->json('POST', "/api/inspecao_tecnica/priority/{$inspecao->pedido_produtos_id}")
      ->seeJsonStructure([
        'data'
      ])
      ->seeStatusCode(200);

    $inspecao = $inspecao->fresh();
    $this->assertEquals(1, $inspecao->priorizado);
  }

  /**
   * Testa se um novo pedido seminovo se associa automaticamente com uma inspeção
   *
   * @return void
   */
  public function test__it_should_be_able_to_allocate_inspection_to_new_pedidos()
  {
    $produto = $this->createProdutoSeminovo();

    $inspecao = $this->createInspecaoWithNoAssociation([
      'produto_sku' => $produto->sku,
      'revisado_at' => date('Y-m-d H:i:s'),
    ]);

    $pedido = $this->createOrder(['status' => 1], $produto->sku);

    $inspecao = $inspecao->fresh();
    $this->assertEquals($pedido->produtos()->first()->id,
      $inspecao->pedido_produtos_id);
  }

  /**
   * Testa se um novo pedido cria uma nova inspeção
   *
   * @return void
   */
  public function test__it_should_be_able_to_create_new_inspection_to_new_pedidos()
  {
    $produto = $this->createProdutoSeminovo();
    $pedido  = $this->createOrder(['status' => 1], $produto->sku);

    $inspecao = InspecaoTecnica::where('pedido_produtos_id', '=',
      $pedido->produtos()->first()->id)
      ->count();

    $this->assertEquals(1, $inspecao);
  }

  /**
   * Testa se ao cancelar um pedido, deleta a inspeção sem revisão
   *
   * @return void
   */
  public function test__it_should_delete_inspecao_when_pedido_canceled()
  {
    $produto = $this->createProdutoSeminovo();
    $pedido  = $this->createOrder(['status' => 1], $produto->sku);

    $pedido->fresh();
    $pedido->status = 5;
    $pedido->save();

    $inspecao = InspecaoTecnica::where('pedido_produtos_id', '=',
      $pedido->produtos()->first()->id)
      ->first();

    $this->assertEquals(0, $inspecao);
  }

}
