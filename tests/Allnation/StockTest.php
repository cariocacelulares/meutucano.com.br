<?php namespace Tests\Allnation;

use Tests\TestCase;
use Tests\CreateUsuario;
use App\Http\Controllers\Auth\AuthenticateController;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class StockTest extends TestCase
{
    use DatabaseTransactions,
        CreateUsuario;

    public function test__it() {}
}
