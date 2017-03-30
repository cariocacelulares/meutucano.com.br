<?php namespace Tests\Core;

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;
use Tests\Core\Create\Pedido;
use Tests\Core\Create\Order\FaturamentoCodigo;
use Tests\Core\Create\Cliente;
use Tests\Core\Create\Cliente\Endereco;

class PedidoTest extends TestCase
{
    use WithoutMiddleware,
        DatabaseTransactions;

    /**
     * If can create order via api
     * @return void
     */
    public function test__it_should_be_able_to_create_order()
    {
        FaturamentoCodigo::generate();

        $cliente_id          = Cliente::create()->id;
        $cliente_endereco_id = Endereco::create([
            'cliente_id' => $cliente_id
        ])->id;

        $data = [
            'cliente_id'          => $cliente_id,
            'cliente_endereco_id' => $cliente_endereco_id,
            'frete_valor'         => rand(1, 50),
            'frete_metodo'        => 'sedex',
            'pagamento_metodo'    => 'boleto',
            'marketplace'         => 'SITE',
            'operacao'            => '6108',
            'total'               => rand(1, 1000),
            'status'              => rand(0, 3),
        ];

        $this->json('POST', '/api/pedidos', $data)
            ->seeStatusCode(201)
            ->seeJsonStructure([
                'data' => [
                    'id',
                    'cliente_id',
                    'cliente_endereco_id',
                    'frete_valor',
                    'frete_metodo',
                    'pagamento_metodo',
                    'marketplace',
                    'operacao',
                    'total',
                    'status',
                ]
            ]);

        $this->seeInDatabase('pedidos', $data);
    }

    /**
     * If can update order via api
     * @return void
     */
    public function test__it_should_be_able_to_update_order()
    {
        $order = Pedido::create();

        $cliente_id          = Cliente::create()->id;
        $cliente_endereco_id = Endereco::create([
            'cliente_id' => $cliente_id
        ])->id;

        $data = [
            'cliente_id'          => $cliente_id,
            'cliente_endereco_id' => $cliente_endereco_id,
            'frete_valor'         => rand(1, 50),
            'total'               => rand(1, 1000),
            'status'              => rand(0, 3),
        ];

        $this->json('PUT', "/api/pedidos/{$order->id}", $data)
            ->seeStatusCode(200)
            ->seeJsonStructure([
                'data' => [
                    'id',
                    'cliente_id',
                    'cliente_endereco_id',
                    'frete_valor',
                    'frete_metodo',
                    'pagamento_metodo',
                    'marketplace',
                    'operacao',
                    'total',
                    'status',
                ]
            ]);

        $this->seeInDatabase('pedidos', array_merge($data, [
            'frete_metodo'        => $order->frete_metodo,
            'pagamento_metodo'    => $order->pagamento_metodo,
            'marketplace'         => $order->marketplace,
            'operacao'            => $order->operacao,
        ]));
    }

    /**
    * Testa se é possível alterar a prioridade do pedido
    *
    * @return void
    */
    public function test__it_should_be_able_to_change_priority()
    {
        $pedido = Pedido::create();

        $this->json('PUT', "/api/pedidos/prioridade/{$pedido->id}", [
            'priorizado' => 1
        ])->seeStatusCode(200);

        $pedido = $pedido->fresh();

        $this->assertEquals(1, $pedido->priorizado);
    }

    /**
    * Testa se é possível segurar o pedido
    *
    * @return void
    */
    public function test__it_should_be_able_to_hold()
    {
        $pedido = Pedido::create();

        $this->json('PUT', "/api/pedidos/segurar/{$pedido->id}", [
            'segurar' => 1
        ])->seeStatusCode(200);

        $pedido = $pedido->fresh();

        $this->assertEquals(1, $pedido->segurado);
    }

    /**
    * Testa se é possível cancelar pedidos sem protocolo com protocolo obrigatório
    *
    * @return void
    */
    public function test__it_should_not_be_able_to_cancel_without_protocolo_in_required_marketplaces()
    {
        $pedido = Pedido::create([
            'marketplace' => 'b2w',
            'status'      => 0
        ]);

        $this->json('POST', "/api/pedidos/status/{$pedido->id}", [
            'status'    => 5
        ])->seeStatusCode(422);
    }

    /**
    * Testa se é possível cancelar pedidos com protocolo obrigatório
    *
    * @return void
    */
    public function test__it_should_be_able_to_cancel_without_protocolo_in_non_required_marketplaces()
    {
        $pedido = Pedido::create([
            'marketplace' => 'site',
            'status'      => 0
        ]);

        $this->json('POST', "/api/pedidos/status/{$pedido->id}", [
            'status'    => 5
        ])->seeStatusCode(200);

        $pedido = $pedido->fresh();

        $this->assertEquals(5, $pedido->status);
    }

    /**
    * Testa se o pedido é marcado como reembolso quando é cancelado depois de pago
    *
    * @return void
    */
    public function test__it_should_mark_as_reembolso_when_canceled_after_paid()
    {
        $pedido = Pedido::create([
            'status' => 1
        ]);

        $this->json('POST', "/api/pedidos/status/{$pedido->id}", [
            'status'    => 5,
            'protocolo' => '123456'
        ])->seeStatusCode(200);

        $pedido = $pedido->fresh();

        $this->assertEquals(1, $pedido->reembolso);
    }

    /**
    * Testa a rota utilizada pela extensao do chrome no shopsystem
    *
    * @return void
    */
    public function test__it_slould_receive_order_info_in_chorme_app_request()
    {
        $order = Pedido::create([
            'status' => 1,
            'codigo_marketplace' => 123456789
        ]);

        $response = $this->json('GET', "/pedidos/shopsystem/{$order->codigo_marketplace}")
            ->seeStatusCode(200)
            ->seeJsonStructure([
                'data' => [
                    'taxvat',
                    'nome',
                    'email',
                    'cep',
                    'telefone',
                    'rua',
                    'numero',
                    'bairro',
                    'complemento',
                    'marketplace',
                    'pedido',
                    'frete'
                ]
            ]);
    }
}
