<?php namespace Tests\Pedido;

use App\Http\Controllers\Pedido\PedidoRastreioController;
use App\Models\PedidoRastreio;
use Tests\RestTestTrait;
use Tests\TestCase;

class PedidoRastreioTest extends TestCase
{
    use RestTestTrait;

    /**
     * @var
     */
    const CONTROLLER = '\App\Http\Controllers\Pedido\PedidoRastreioController';

    /**
     * Test if user can edit information about the model
     */
    public function test__it_should_be_able_to_edit()
    {
        $this->json(
            'PUT',
            '/api/rastreios/edit/1',
            [
                'cep'        => '89160216',
                'rastreio'   => 'PJ123BR',
                'prazo'      => '5',
                'data_envio' => '10/04/2016',
            ],
            ['HTTP_Authorization' => 'Bearer ' . $this->userToken]
        )->seeJson([
            'code' => 200,
            'status' => 'success'
        ]);

        $rastreio = PedidoRastreio::find(1);
        $this->assertArraySubset([
            'data_envio' => '2016-04-10',
            'rastreio'   => 'PJ123BR',
            'prazo'      => '5',
            'status'     => '0',
        ], $rastreio->getAttributes());

        $endereco = $rastreio->pedido->endereco;
        $this->assertEquals('89160216', $endereco->cep);
    }

    /**
     * Test if user can refresh single model
     */
    public function test__it_should_be_able_to_refresh()
    {
        $rastreio = PedidoRastreio::find(1);
        $rastreio->fill([
            'rastreio'   => 'PJ123BR',
            'prazo'      => '5',
            'data_envio' => '2016-04-10',
            'status'     => 3
        ]);
        $rastreio->save();

        $this->json(
            'PUT',
            '/api/rastreios/refresh_status/1',
            [],
            ['HTTP_Authorization' => 'Bearer ' . $this->userToken]
        )->seeJson([
            'code' => 200,
            'status' => 'success'
        ]);

        $rastreio = PedidoRastreio::find(1);
        $this->assertEquals(3, $rastreio->status);
    }

    /**
     * Test if deadline can be calculated
     */
    public function test__it_should_be_able_to_calculate_deadline()
    {
        $response = PedidoRastreioController::deadline('PJ123BR', '89160216');

        $this->assertGreaterThan(0, $response);
    }


    /**
     * Test if deadline can be calculated
     * TODO
     */
    public function test__it_should_be_able_to_generate_pdf()
    {

    }
}
