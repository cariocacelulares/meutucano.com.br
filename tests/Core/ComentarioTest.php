<?php namespace Tests\Core;

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;
use Tests\Core\Create\Pedido;
use Tests\Core\Create\Comentario;

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
        $pedido = Pedido::create();

        $data = [
            'comentario' => 'Teste de comentário',
            'pedido_id'  => $pedido->id
        ];

        Comentario::create($data);

        $this->json('GET', "/api/comentarios/{$pedido->id}")
            ->seeStatusCode(200)
            ->seeJsonStructure([
                'data'
            ]);

        $this->seeInDatabase('pedido_comentarios', $data);
    }

    /**
    * Test if comment can be created
    *
    * @return void
    */
    public function test__it_should_create_comment()
    {
        $data = [
            'comentario' => 'Teste de comentário',
            'pedido_id'  => Pedido::create()->id
        ];

        $this->json('POST', '/api/comentarios', $data)
            ->seeStatusCode(201)
            ->seeJsonStructure([
                'data' => [
                    'id',
                    'comentario',
                    'pedido_id',
                ]
            ]);

        $this->seeInDatabase('pedido_comentarios', $data);
    }

    /**
    * Test if comment can be deleted
    *
    * @return void
    */
    public function test__it_should_delete_comment()
    {
        $comentario = Comentario::create([
            'comentario' => 'Teste de comentário',
            'pedido_id'  => Pedido::create()->id
        ]);

        $this->json('DELETE', "/api/comentarios/{$comentario->id}")
            ->seeStatusCode(204);
    }
}
