<?php namespace Tests\Magento;

use VCR\VCR;
use Tests\TestCase;
use Core\Events\OrderCancel;
use Tests\Core\CreatePedido;
use Core\Models\Pedido;
use Magento\Http\Controllers\MagentoController;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class MagentoTest extends TestCase
{
    use WithoutMiddleware,
        DatabaseTransactions;

    const MAGENTO_ORDER = 200000846;

    public function setUp()
    {
        parent::setUp();
        /*
        // Remove token from request verification
        VCR::configure()
            ->addRequestMatcher(
                'check_session_id',
                function (\VCR\Request $first, \VCR\Request $second) {
                    $bodyFirst  = preg_replace('/[a-zA-Z0-9]{32}/', '', $first->getBody());
                    $bodySecond = preg_replace('/[a-zA-Z0-9]{32}/', '', $second->getBody());

                    return !($bodyFirst !== $bodySecond);
                }
            )
            ->enableRequestMatchers([
                'method', 'url', 'host', 'check_session_id'
            ]);*/
    }

    /**
    * Test if order can be imported
    *
    * @return void
    */
    public function test__it_should_import_order()
    {
        /*$magentoApi = new MagentoController();

        VCR::turnOn();
        VCR::insertCassette('order.import.yml');

        $magentoApi->syncOrder(self::MAGENTO_ORDER);

        VCR::eject();
        VCR::turnOff();

        $order = Pedido::where('codigo_api', '=', self::MAGENTO_ORDER)->first();
        $this->assertTrue($order->codigo_marketplace == self::MAGENTO_ORDER);*/
    }

    /**
     * Test if cancel listener is beign activated
     *
     * @return void
     * @expectedException Exception
     */
    /*public function test__it_should_active_listener_on_order_cancel()
    {
        $order = CreatePedido::create([
            'marketplace' => 'site',
            'codigo_api'  => self::MAGENTO_ORDER
        ]);

        VCR::configure()->setMode('once');
        VCR::turnOn();
        VCR::insertCassette('order.cancel.listener.yml');

        $order->status = 5;
        $order->save();

        VCR::eject();
        VCR::turnOff();
    }*/
}
