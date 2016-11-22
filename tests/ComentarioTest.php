<?php namespace Tests;

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use App\Models\Pedido\Comentario;

class ComentarioTest extends TestCase
{
  use WithoutMiddleware,
    DatabaseMigrations,
    DatabaseTransactions,
    CreatePedido;

  /**
   * Testa se é possível listar os comentários
   *
   * @return void
   */
  public function test_it_should_be_able_to_list_comentarios_from_pedido()
  {
    $pedido = $this->createPedido();

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
   * Testa se é possível criar um comentário
   *
   * @return void
   */
  public function test_it_should_be_able_to_create_comentario()
  {
    $this->json('POST', '/api/comentarios', [
      'comentario' => 'Teste de comentário',
      'pedido_id'  => $this->createPedido()->id
    ])->seeStatusCode(201);

    $this->seeInDatabase('pedido_comentarios', [
      'comentario' => 'Teste de comentário'
    ]);
  }

  /**
   * Testa se é possível deletar um comentário
   *
   * @return void
   */
  public function test__it_should_be_able_to_delete_comentario()
  {
    $comentario = factory(Comentario::class)->create([
      'comentario' => 'Teste de comentário',
      'pedido_id'  => $this->createPedido()->id
    ]);

    $this->json('DELETE', "/api/comentarios/{$comentario->id}")
      ->seeStatusCode(204);
  }
}