<?php namespace Tests\Pedido;

use App\Models\PedidoRastreio;
use App\Models\PedidoRastreioLogistica;
use Tests\TestCase;

class PedidoRastreioLogisticaTest extends TestCase
{
    /**
     * Test if it is correctly creating new model and persisting it without new rastreio
     */
    public function test__it_should_be_able_to_register_new_logistica_without_rastreio()
    {
        // Apenas código da logistica e motivo
        $this->json(
            'PUT',
            '/api/logisticas/edit/1',
            [
                'autorizacao' => '123',
                'motivo'      => 0,
            ],
            ['HTTP_Authorization' => 'Bearer ' . $this->userToken]
        )->seeJson([
            'code' => 200,
            'status' => 'success'
        ]);

        $pi = PedidoRastreioLogistica::find(1);
        $this->assertArraySubset([
            'autorizacao' => '123',
            'motivo'      => 0,
        ], $pi->getAttributes());

        //Retorno dos correios
        $this->json(
            'PUT',
            '/api/logisticas/edit/1',
            [
                'acao'                    => 1,
                'data_postagem_readable'  => '10/04/2016',
                'protocolo'               => '123',
                'observacoes'             => 'test',
            ],
            ['HTTP_Authorization' => 'Bearer ' . $this->userToken]
        )->seeJson([
            'code' => 200,
            'status' => 'success'
        ]);

        $rastreio = PedidoRastreio::find(1);
        $this->assertEquals(5, $rastreio->status);

        $pi = PedidoRastreioLogistica::find(1);
        $this->assertArraySubset([
            'acao'           => 1,
            'data_postagem'  => '2016-04-10',
            'protocolo'      => '123',
            'observacoes'    => 'test',
        ], $pi->getAttributes());
    }

    /**
     * Test if it is correctly creating new model and persisting it with new rastreio
     */
    public function test__it_should_be_able_to_register_new_logistica_with_rastreio()
    {
        // Apenas código da pi e motivo
        $this->json(
            'PUT',
            '/api/logisticas/edit/2',
            [
                'autorizacao' => '123',
                'motivo'      => 0,
            ],
            ['HTTP_Authorization' => 'Bearer ' . $this->userToken]
        )->seeJson([
            'code' => 200,
            'status' => 'success'
        ]);

        $pi = PedidoRastreioLogistica::find(2);
        $this->assertArraySubset([
            'autorizacao' => '123',
            'motivo'      => 0,
        ], $pi->getAttributes());

        //Retorno dos correios
        $this->json(
            'PUT',
            '/api/logisticas/edit/2',
            [
                'acao'                    => 0,
                'data_postagem_readable'  => '10/04/2016',
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
        $this->assertEquals(5, $rastreio->status);

        $this->seeInDatabase(with(new PedidoRastreio())->getTable(), [
            'rastreio_ref_id' => 2,
            'rastreio'        => 'PJ123BR',
            'valor'           => 10.35
        ]);

        $pi = PedidoRastreioLogistica::find(2);
        $this->assertArraySubset([
            'acao'          => 0,
            'data_postagem' => '2016-04-10',
            'observacoes'   => 'test',
        ], $pi->getAttributes());
    }
}
