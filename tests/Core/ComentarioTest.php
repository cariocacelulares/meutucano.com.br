<?php namespace Tests\Core;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Core\Models\Pedido\Comentario;

class ComentarioTest extends TestCase
{
  use WithoutMiddleware,
    DatabaseMigrations,
    DatabaseTransactions,
    CreatePedido;

  /**
   * Test if order comments can be listed
   *
   * @return void
   */
  public function it_should_list_comments_from_order()
  {
    $pedido = $this->createOrder();

    factory(Comentario::class)->create([
      'comentario' => 'Teste de comentário',
      'pedido_id'  => $pedido->id
    ]);

    $this->json('GET', "/api/comentarios/{$pedido->id}")
      ->seeStatusCode(200)
      ->seeJsonStructure([
        'data'
      ]);
  }

  /**
   * Test if comment can be created
   *
   * @return void
   */
  public function test__it_should_create_comment()
  {
    $this->json('POST', '/api/comentarios', [
      'comentario' => 'Teste de comentário',
      'pedido_id'  => $this->createOrder()->id
    ])->seeStatusCode(201);

    $this->seeInDatabase('pedido_comentarios', [
      'comentario' => 'Teste de comentário'
    ]);
  }

  /**
   * Test if comment can be deleted
   *
   * @return void
   */
  public function test__it_should_delete_comment()
  {
    $comentario = factory(Comentario::class)->create([
      'comentario' => 'Teste de comentário',
      'pedido_id'  => $this->createOrder()->id
    ]);

    $this->json('DELETE', "/api/comentarios/{$comentario->id}")
      ->seeStatusCode(204);
  }
}