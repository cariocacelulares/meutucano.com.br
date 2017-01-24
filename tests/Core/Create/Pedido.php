<?php namespace Tests\Core\Create;

use Core\Models\Pedido as PedidoModel;
use Tests\Core\Create\FaturamentoCodigo;
use Tests\Core\Create\Cliente;
use Tests\Core\Create\Endereco;
use Tests\Core\Create\PedidoProduto;

class Pedido
{
    /**
    * Create one order
    *
    * @return Core\Models\Pedido
    */
    public static function create($data = [], $productSku = null)
    {
        FaturamentoCodigo::generate();

        if (!isset($data['cliente_id'])) {
            $data['cliente_id'] = Cliente::create()->id;
        }

        if (!isset($data['cliente_endereco_id'])) {
            $data['cliente_endereco_id'] = Endereco::create([
                'cliente_id' => $data['cliente_id']
            ])->id;
        }

        $pedido = factory(PedidoModel::class)->create($data);

        PedidoProduto::create([
            'pedido_id' => $pedido->id,
        ]);

        return $pedido;
    }
}
