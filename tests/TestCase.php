<?php namespace Tests;

use App\Models\Usuario;
use Illuminate\Contracts\Console\Kernel;
use Tymon\JWTAuth\Facades\JWTAuth;

class TestCase extends \Illuminate\Foundation\Testing\TestCase
{
    /**
     * The base URL to use while testing the application.
     *
     * @var string
     */
    protected $baseUrl = 'http://localhost';

    /**
     * @var Usuario
     */
    protected $authUser;

    /**
     * @var string
     */
    protected $userToken;

    /**
     * Creates the application.
     *
     * @return \Illuminate\Foundation\Application
     */
    public function createApplication()
    {
        $app = require __DIR__.'/../bootstrap/app.php';
        $app->make(Kernel::class)->bootstrap();

        return $app;
    }

    public function setUp()
    {
        parent::setUp();
        \Artisan::call('migrate');
        \Artisan::call('db:seed', ['--class' => 'TestSeeder']);
        $this->setAuthUser();
    }

    public function tearDown()
    {
        \Artisan::call('migrate:reset');
        parent::tearDown();
    }

    /**
     * Define user and token based on factory
     */
    protected function setAuthUser()
    {
        if (!$user = Usuario::find(1))
            $user = factory(Usuario::class)->create([
                'id' => 1
            ]);

        $this->authUser  = $user;
        $this->userToken = JWTAuth::fromUser($user);
    }
}

