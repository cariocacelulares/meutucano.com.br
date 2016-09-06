<?php namespace Tests\Pedido;

use App\Models\PedidoRastreio;
use App\Models\PedidoRastreioPi;
use Tests\TestCase;

class PedidoRastreioPiTest extends TestCase
{
    /**
     * Test if it is correctly creating new model and persisting it
     */
    public function test__it_should_be_able_to_register_new_pi_atraso()
    {
        // Apenas código da pi e motivo
        $this->json(
            'PUT',
            '/api/pis/edit/1',
            [
                'motivo_status' => 2,
                'codigo_pi'     => '123',
            ],
            ['HTTP_Authorization' => 'Bearer ' . $this->userToken]
        )->seeJson([
            'code' => 200,
            'status' => 'success'
        ]);

        $rastreio = PedidoRastreio::find(1);
        $this->assertEquals(7, $rastreio->status);

        $pi = PedidoRastreioPi::find(1);
        $this->assertArraySubset([
            'motivo_status' => 2,
            'codigo_pi'     => '123',
        ], $pi->getAttributes());

        //Retorno dos correios
        $this->json(
            'PUT',
            '/api/pis/edit/1',
            [
                'status'                  => 1,
                'data_pagamento_readable' => '10/04/2016',
                'valor_pago'              => 10.30,
                'observacoes'             => 'test'
            ],
            ['HTTP_Authorization' => 'Bearer ' . $this->userToken]
        )->seeJson([
            'code' => 200,
            'status' => 'success'
        ]);

        $rastreio = PedidoRastreio::find(1);
        $this->assertEquals(8, $rastreio->status);

        $pi = PedidoRastreioPi::find(1);
        $this->assertArraySubset([
            'status'         => 1,
            'data_pagamento' => '2016-04-10',
            'valor_pago'     => 10.30,
            'observacoes'    => 'test'
        ], $pi->getAttributes());
    }

    /**
     * Test if it is correctly creating new model and persisting it without new rastreio
     */
    public function test__it_should_be_able_to_register_new_pi_extravio_without_rastreio()
    {
        // Apenas código da pi e motivo
        $this->json(
            'PUT',
            '/api/pis/edit/3',
            [
                'motivo_status' => 3,
                'codigo_pi'     => '123',
            ],
            ['HTTP_Authorization' => 'Bearer ' . $this->userToken]
        )->seeJson([
            'code' => 200,
            'status' => 'success'
        ]);

        $rastreio = PedidoRastreio::find(3);
        $this->assertEquals(7, $rastreio->status);

        $pi = PedidoRastreioPi::find(3);
        $this->assertArraySubset([
            'motivo_status' => 3,
            'codigo_pi'     => '123',
        ], $pi->getAttributes());

        //Retorno dos correios
        $this->json(
            'PUT',
            '/api/pis/edit/3',
            [
                'status'                  => 1,
                'data_pagamento_readable' => '10/04/2016',
                'valor_pago'              => 10.30,
                'acao'                    => 1,
                'pago_cliente'            => 1,
                'protocolo'               => '123',
                'observacoes'             => 'test',
            ],
            ['HTTP_Authorization' => 'Bearer ' . $this->userToken]
        )->seeJson([
            'code' => 200,
            'status' => 'success'
        ]);

        $rastreio = PedidoRastreio::find(3);
        $this->assertEquals(8, $rastreio->status);

        $pi = PedidoRastreioPi::find(3);
        $this->assertArraySubset([
            'status'         => 1,
            'data_pagamento' => '2016-04-10',
            'valor_pago'     => 10.30,
            'acao'           => 1,
            'pago_cliente'   => 1,
            'protocolo'      => '123',
            'observacoes'    => 'test',
        ], $pi->getAttributes());
    }

    /**
     * Test if it is correctly creating new model and persisting it with new rastreio
     */
    public function test__it_should_be_able_to_register_new_pi_extravio_with_rastreio()
    {
        // Apenas código da pi e motivo
        $this->json(
            'PUT',
            '/api/pis/edit/2',
            [
                'motivo_status' => 3,
                'codigo_pi'     => '123',
            ],
            ['HTTP_Authorization' => 'Bearer ' . $this->userToken]
        )->seeJson([
            'code' => 200,
            'status' => 'success'
        ]);

        $rastreio = PedidoRastreio::find(2);
        $this->assertEquals(7, $rastreio->status);

        $pi = PedidoRastreioPi::find(2);
        $this->assertArraySubset([
            'motivo_status' => 3,
            'codigo_pi'     => '123',
        ], $pi->getAttributes());

        //Retorno dos correios
        $this->json(
            'PUT',
            '/api/pis/edit/2',
            [
                'status'                  => 1,
                'data_pagamento_readable' => '10/04/2016',
                'valor_pago'              => 10.30,
                'acao'                    => 0,
                'pago_cliente'            => 1,
                'observacoes'             => 'test',
                'rastreio_ref'            => [
                    'rastreio' => 'PJ123BR',
                    'valor'    => 10.35
                ],
            ],
            ['HTTP_Authorization' => 'Bearer ' . $this->userToken]
        )->seeJson([
            'code' => 200,
            'status' => 'success'
        ]);

        $rastreio = PedidoRastreio::find(2);
        $this->assertEquals(8, $rastreio->status);

        $this->seeInDatabase(with(new PedidoRastreio())->getTable(), [
            'rastreio_ref_id' => 2,
            'rastreio'        => 'PJ123BR',
            'valor'           => 10.35
        ]);

        $pi = PedidoRastreioPi::find(2);
        $this->assertArraySubset([
            'status'         => 1,
            'data_pagamento' => '2016-04-10',
            'valor_pago'     => 10.30,
            'acao'           => 0,
            'pago_cliente'   => 1,
            'observacoes'    => 'test',
        ], $pi->getAttributes());
    }
}
