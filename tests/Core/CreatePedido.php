<?php namespace Tests\Core;

use Core\Models\Pedido\Nota;
use Core\Models\Pedido\Pedido;
use Core\Models\Pedido\Imposto;
use Core\Models\Produto\Produto;
use Core\Models\Usuario\Usuario;
use Core\Models\Cliente\Cliente;
use Core\Models\Cliente\Endereco;
use Core\Models\Pedido\PedidoProduto;
use Tests\Core\CreateFaturamentoCodigo;

trait CreatePedido
{
    use CreateProduto,
        CreateFaturamentoCodigo;

    /**
    * Create one order
    *
    * @return Core\Models\Pedido\Pedido
    */
    public function createOrder($data = [], $productSku = null, $withoutMl = false)
    {
        if ($withoutMl) {
            $marketplaces        = ['B2W', 'CNOVA', 'SITE', 'WALMART'];
            $data['marketplace'] = $marketplaces[rand(0, 3)];
        }

        $this->generateFaturamentoCodigo();

        $cliente = factory(Cliente::class)->create();
        $endereco = factory(Endereco::class)->create([
            'cliente_id' => $cliente->id
        ]);

        $pedido = factory(Pedido::class)->create(array_merge($data, [
            'cliente_id'          => $cliente->id,
            'cliente_endereco_id' => $endereco->id
        ]));

        factory(PedidoProduto::class)->create([
            'pedido_id'   => $pedido->id,
            'produto_sku' => ($productSku)
                ? Produto::find($productSku)->sku
                : $this->createProduto()->sku
        ]);

        return $pedido;
    }
}
