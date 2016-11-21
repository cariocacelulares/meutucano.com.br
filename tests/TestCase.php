<?php namespace Tests;

use Illuminate\Contracts\Console\Kernel;
use Illuminate\Contracts\Auth\Authenticatable as UserContract;

class TestCase extends \Illuminate\Foundation\Testing\TestCase
{
  /**
   * @var string
   */
  protected $baseUrl = 'http://tucano.app';

  /**
   * @var User
   */
  protected $user;

  /**
   * Boostrap application
   *
   * @return \Illuminate\Foundation\Application
   */
  public function createApplication()
  {
    $app = require __DIR__.'/../bootstrap/app.php';
    $app->make(Kernel::class)->bootstrap();

    return $app;
  }

  /**
   * Setup test case
   *
   * @return void
   */
  public function setUp()
  {
    parent::setUp();
  }

  /**
   * Teardown test case
   *
   * @return void
   */
  public function tearDown()
  {
  }

  /**
   * Set the currently logged in user for the application.
   *
   * @param  \Illuminate\Contracts\Auth\Authenticatable $user
   * @param  string|null                                $driver
   * @return $this
   */
  public function actingAs(UserContract $user, $driver = null)
  {
      $this->user = $user;
      return $this;
  }

  /**
   * Call the given URI and return the Response.
   *
   * @param  string $method
   * @param  string $uri
   * @param  array  $parameters
   * @param  array  $cookies
   * @param  array  $files
   * @param  array  $server
   * @param  string $content
   * @return \Illuminate\Http\Response
   */
  public function call($method, $uri, $parameters = [], $cookies = [], $files = [], $server = [], $content = null)
  {
      if ($this->user) {
          $server['HTTP_AUTHORIZATION'] = 'Bearer ' . \JWTAuth::fromUser($this->user);
      }
      $server['HTTP_ACCEPT'] = 'application/json';
      return parent::call($method, $uri, $parameters, $cookies, $files, $server, $content);
  }
}

