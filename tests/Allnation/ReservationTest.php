<?php namespace Tests\Allnation;

use App\Http\Controllers\Auth\AuthenticateController;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class ReservationTest extends TestCase
{
  use DatabaseMigrations,
    DatabaseTransactions,
    CreateUsuario;


}
