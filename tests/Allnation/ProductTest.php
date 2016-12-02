<?php namespace Tests\Allnation;

use App\Http\Controllers\Auth\AuthenticateController;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class ProductTest extends TestCase
{
  use DatabaseMigrations,
    DatabaseTransactions,
    CreateUsuario;


}
