<?php namespace Tests;

use App\Models\Usuario\Usuario;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use JWTAuth;

class AuthTest extends TestCase
{
  use DatabaseMigrations;

  public function setUp() {
    parent::setUp();

    $this->userData = [
      'name' => 'Test',
      'username' => 'test',
      'password' => 'test',
    ];

    $this->userObject = Usuario::create($this->userData);

    $this->userToken = JWTAuth::fromUser($this->userObject);
  }

  public function test__it_should_be_able_to_authenticate()
  {
    $this->json('POST', '/api/authenticate', $this->userData)
      ->seeJsonStructure([
      'token'
    ]);
  }

  public function test__it_should_return_error_when_credentials_are_wrong()
  {
    $this->json('POST', '/api/authenticate', [
      'username' => 'test',
      'password' => 'test2'
    ])->seeJson([
      'error' => 'invalid_credentials'
    ]);

  }

  public function test__it_should_not_be_able_to_use_api_when_unauthenticated()
  {
    $this->json('GET', '/api/pedidos', [])->seeJson([
      'error' => 'token_not_provided'
    ]);
  }

  public function test__it_should_be_able_to_return_user_information()
  {
    $this->json('/api/authenticate/user', [], [
      'HTTP_Authorization' => 'Bearer ' . $this->userToken
    ])->seeJson([
      'user'
    ]);
  }
}
