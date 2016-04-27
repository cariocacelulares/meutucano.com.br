<?php namespace Tests\Pedido;

use App\Models\PedidoRastreio;
use App\Models\PedidoRastreioDevolucao;
use Tests\TestCase;

class PedidoRastreioDevolucaoTest extends TestCase
{
    /**
     * Test if it is correctly creating new model and persisting it without new rastreio
     */
    public function test__it_should_be_able_to_register_new_devolucao_without_rastreio()
    {
        $this->json(
            'PUT',
            '/api/devolucoes/edit/1',
            [
                'motivo'      => 0,
                'acao'        => 1,
                'protocolo'   => '123',
                'observacoes' => 'test'
            ],
            ['HTTP_Authorization' => 'Bearer ' . $this->userToken]
        )->seeJson([
            'code' => 200,
            'status' => 'success'
        ]);

        $rastreio = PedidoRastreio::find(1);
        $this->assertEquals(5, $rastreio->status);

        $devolucao = PedidoRastreioDevolucao::find(1);
        $this->assertArraySubset([
            'motivo' => 0,
            'acao'   => 1,
            'protocolo' => '123',
            'observacoes' => 'test'
        ], $devolucao->getAttributes());
    }

    /**
     * Test if it is correctly creating new model and persisting it with new rastreio
     */
    public function test__it_should_be_able_to_register_new_devolucao_with_rastreio()
    {
        $this->json(
            'PUT',
            '/api/devolucoes/edit/2',
            [
                'motivo'       => 0,
                'acao'         => 0,
                'rastreio_ref' => [
                    'rastreio'     => 'PJ123BR',
                    'valor'        => 10.35
                ],
                'pago_cliente' => 1,
                'observacoes'  => 'test'
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

        $devolucao = PedidoRastreioDevolucao::find(2);
        $this->assertArraySubset([
            'motivo'       => 0,
            'acao'         => 0,
            'pago_cliente' => 1,
            'observacoes'  => 'test'
        ], $devolucao->getAttributes());
    }
}
