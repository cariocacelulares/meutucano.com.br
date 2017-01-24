<?php namespace Tests\Core;

use Tests\TestCase;
use Core\Models\Pedido\Comentario;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class ComentarioTest extends TestCase
{
    use WithoutMiddleware,
        DatabaseTransactions;

    /**
    * Test if order comments can be listed
    *
    * @return void
    */
    public function test__it_should_list_comments_from_order()
    {
        $pedido = CreatePedido::create();

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
            'pedido_id'  => CreatePedido::create()->id
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
            'pedido_id'  => CreatePedido::create()->id
        ]);

        $this->json('DELETE', "/api/comentarios/{$comentario->id}")
            ->seeStatusCode(204);
    }
}
