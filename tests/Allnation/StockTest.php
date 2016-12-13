<?php namespace Tests\Allnation;

use App\Http\Controllers\Auth\AuthenticateController;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\CreateUsuario;
use Tests\TestCase;

class StockTest extends TestCase
{
  use DatabaseMigrations,
    DatabaseTransactions,
    CreateUsuario;


}
