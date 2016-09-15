<?php namespace Tests;

use App\Models\Usuario\Usuario;

class AuthTest extends TestCase
{
    /**
     * Test if login is working
     *
     * @return void
     */
    public function test__it_should_return_token_when_aunthenticate()
    {
        $loginData = [
            'name'     => 'Test User',
            'username' => 'test',
            'password' => 'test'
        ];

        Usuario::create($loginData);

        $this->json('POST', '/api/authenticate', $loginData)->seeJsonStructure([
            'token'
        ]);
    }

    /**
     * Test if auth middleware is working and blocking non-auth requests
     *
     * @return void
     */
    public function test__it_should_block_requests_when_token_not_provided()
    {
        $this->json('GET', '/api/pedidos', [])->seeJson([
            'error' => 'token_not_provided'
        ]);
    }
}
