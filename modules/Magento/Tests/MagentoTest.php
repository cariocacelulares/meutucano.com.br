<?php namespace Modules\Magento\Tests;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Modules\Magento\Http\Controllers\MagentoController;

class MagentoTest extends TestCase
{
  use WithoutMiddleware,
    DatabaseMigrations,
    DatabaseTransactions;

  /**
   * Test if order can be imported
   *
   * @return void
   * @vcr ../../modules/Magento/Tests/fixtures/order.import.yml
   */
  public function test__it_should_import_order()
  {
    with(new MagentoController())->syncOrder('200000594');
  }
}
