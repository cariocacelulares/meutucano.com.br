<?php namespace Tests;

use JWTAuth;
use App\Models\Usuario\Usuario;
use App\Http\Controllers\Auth\AuthenticateController;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class AuthTest extends TestCase
{
    use DatabaseTransactions;

    /**
    * Testa se o usuário pode logar no sistema
    *
    * @return void
    */
    public function test__it_should_be_able_to_authenticate()
    {
        $authData = ['email' => 'test@example.com', 'password' => 'test'];

        $usuario = CreateUsuario::create($authData);

        $this->json('POST', '/api/authenticate', $authData)->seeJsonStructure([
            'token'
        ]);

        $this->seeStatusCode(200);
    }

    /**
    * Testa se não é possível logar com usuário/senha errados
    *
    * @return void
    */
    public function test__it_should_return_error_when_credentials_are_wrong()
    {
        $this->json('POST', '/api/authenticate', [
            'email'    => 'test@example.com',
            'password' => 'test2'
        ])->seeJson([
            'error' => 'invalid_credentials'
        ]);

        $this->seeStatusCode(401);
    }

    /**
    * Testa se não pode utilizar a API quando não está autenticado
    *
    * @return void
    */
    public function test__it_should_not_be_able_to_use_api_when_unauthenticated()
    {
        $this->json('GET', '/api/pedidos', [])->seeJson([
            'error' => 'token_not_provided'
        ]);
    }
}
