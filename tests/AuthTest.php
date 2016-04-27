<?php namespace Tests;

use App\Models\Usuario;

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
            'email'    => 'test@example.com',
            'password' => 'test'
        ];

        $userData = $loginData;
        $userData['password'] = bcrypt($userData['password']);

        Usuario::create($userData);

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

    /**
     * Test if auth users can access API
     *
     * @return void
     */
    public function test__it_should_allow_requests_when_token_provided()
    {
        $this->json('GET', '/api/pedidos?token=' . $this->userToken, [])->seeJson([
            'code'   => 200,
            'status' => 'success'
        ]);
    }
}
