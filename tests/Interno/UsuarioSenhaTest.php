<?php namespace Tests\Interno;

use App\Models\UsuarioSenha;
use Tests\TestCase;

class UsuarioSenhaTest extends TestCase
{
    /**
     * Test if user can fetch passwords by user id
     */
    public function test__it_should_be_able_to_fetch_passwords_by_user_id()
    {
        factory(UsuarioSenha::class)->create([
            'usuario_id' => $this->authUser->id
        ]);

        $this->json(
            'GET',
            '/api/senhas/usuario/1',
            [],
            ['HTTP_Authorization' => 'Bearer ' . $this->userToken]
        )->seeJson([
            'code' => 200,
            'status' => 'success'
        ]);
    }

    /**
     * Test if user can fetch passwords by user id
     */
    public function test__it_should_be_able_to_fetch_own_passwords()
    {
        factory(UsuarioSenha::class)->create();

        $this->json(
            'GET',
            '/api/minhas-senhas',
            [],
            ['HTTP_Authorization' => 'Bearer ' . $this->userToken]
        )->seeJson([
            'code' => 200,
            'status' => 'success'
        ]);
    }
}
