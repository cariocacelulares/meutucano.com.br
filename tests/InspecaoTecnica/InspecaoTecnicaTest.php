<?php namespace Tests\InspecaoTecnica;

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use InspecaoTecnica\Models\InspecaoTecnica;
use Tests\TestCase;

class InspecaoTecnicaTest extends TestCase
{
    use WithoutMiddleware,
        DatabaseMigrations,
        DatabaseTransactions,
        CreateInspecao;

    /**
    * Testa se é possível definir uma inspeção como proriodade
    *
    * @return void
    */
    public function test__it_should_be_able_to_change_priority()
    {
        $inspecao = $this->createInspecao();

        $this->json('POST', "/api/inspecao_tecnica/priority/{$inspecao->pedido_produtos_id}")
            ->seeJsonStructure([
                'data'
            ])
            ->seeStatusCode(200);

        $inspecao = $inspecao->fresh();
        $this->assertEquals(1, $inspecao->priorizado);
    }

    /**
    * Testa se um novo pedido seminovo se associa automaticamente com uma inspeção
    *
    * @return void
    */
    public function test__it_should_be_able_to_attach_inspection_to_new_pedidos()
    {
        $produto = $this->createProdutoSeminovo();

        $inspecao = $this->createInspecaoWithNoAssociation([
            'produto_sku' => $produto->sku,
            'revisado_at' => date('Y-m-d H:i:s'),
        ]);

        $pedido = $this->createOrder(['status' => 1], $produto->sku);

        $inspecao = $inspecao->fresh();
        $this->assertEquals($pedido->produtos()->first()->id,
        $inspecao->pedido_produtos_id);
    }

    /**
    * Testa se um novo pedido cria uma nova inspeção
    *
    * @return void
    */
    public function test__it_should_be_able_to_create_new_inspection_to_new_pedidos()
    {
        $produto = $this->createProdutoSeminovo();
        $pedido  = $this->createOrder(['status' => 1], $produto->sku);

        $inspecao = InspecaoTecnica::where('pedido_produtos_id', '=',
            $pedido->produtos()->first()->id)
            ->count();

        $this->assertEquals(1, $inspecao);
    }

    /**
    * Testa se ao cancelar um pedido, deleta a inspeção sem revisão
    *
    * @return void
    */
    public function test__it_should_delete_inspecao_when_pedido_canceled()
    {
        $produto = $this->createProdutoSeminovo();
        $pedido  = $this->createOrder(['status' => 1], $produto->sku);
        $pedido->status = 5;
        $pedido->save();

        $inspecao = InspecaoTecnica::where('pedido_produtos_id', '=',
            $pedido->produtos()->first()->id)
            ->count();

        $this->assertEquals(0, $inspecao);
    }

    /**
     * Testa se quando aumenta a quantidade de um pedido produto, aloca uma nova inspecao tecnica
     *
     * @return void
     */
    public function test__it_should_attach_inspection_when_order_product_quantity_inscreased()
    {
        $product      = $this->createProdutoSeminovo();
        $order        = $this->createOrder(['status' => 1], $product->sku);
        $orderProduct = $order->produtos()->first();

        $orderProduct->quantidade = $orderProduct->quantidade + 1;
        $orderProduct->save();

        $inspection = InspecaoTecnica::where('pedido_produtos_id', '=',
            $orderProduct->id)
            ->count();

        $this->assertEquals($orderProduct->quantidade, $inspection);
    }

    /**
     * Testa se quando aumenta a quantidade de um pedido produto, e existir uma inspecao sem pedido, relaciona esses dois
     *
     * @return void
     */
    public function test__it_should_attach_inspection_when_order_product_quantity_inscreased_and_exists_an_inspection_without_order()
    {
        $product = $this->createProdutoSeminovo();

        $inspection = InspecaoTecnica::where('produto_sku', '=', $product->sku)
            ->first();

        $inspection = $this->createInspecaoWithNoAssociation([
            'produto_sku' => $product->sku,
            'revisado_at' => date('Y-m-d H:i:s'),
        ]);

        $order        = $this->createOrder(['status' => 1], $product->sku);
        $orderProduct = $order->produtos()->first();

        $orderProduct->quantidade = $orderProduct->quantidade + 1;
        $orderProduct->save();

        $inspection = $inspection->fresh();

        $this->assertEquals($orderProduct->id, $inspection->pedido_produtos_id);
    }

    /**
     * Testa se quando diminui a quantidade de um pedido produto, deleta uma inspecao nao revisada
     *
     * @return void
     */
    public function test__it_should_delete_non_reviewed_inspection_when_order_product_quantity_decreased()
    {
        $product      = $this->createProdutoSeminovo();
        $order        = $this->createOrder(['status' => 1], $product->sku);
        $orderProduct = $order->produtos()->first();
        $inspection   = InspecaoTecnica::where('pedido_produtos_id', '=', $orderProduct->id)->whereNull('revisado_at')
                            ->first();

        $orderProduct->quantidade = $orderProduct->quantidade - 1;
        $orderProduct->save();

        $inspection = $inspection->fresh();

        $this->assertEquals(null, $inspection);
    }

    /**
     * Testa se quando diminui a quantidade de um pedido produto, desassocia um pedido produto
     *
     * @return void
     */
    public function test__it_should_detach_reviewed_inspection_when_order_product_quantity_decreased()
    {
        $product      = $this->createProdutoSeminovo();
        $order        = $this->createOrder(['status' => 1], $product->sku);
        $orderProduct = $order->produtos()->first();
        $inspection   = InspecaoTecnica::where('pedido_produtos_id', '=', $orderProduct->id)
                            ->first();

        $inspection->revisado_at = date('Y-m-d H:i:s');
        $inspection->save();

        $orderProduct->quantidade = $orderProduct->quantidade - 1;
        $orderProduct->save();

        $inspection = $inspection->fresh();

        $this->assertEquals(null, $inspection->pedido_produtos_id);
    }

    /**
     * Testa se quando o produto de um pedido produto for alterado, e a inspecao nao foi revisada, exclui ela
     *
     * @return void
     */
    public function test__it_should_delete_non_reviewed_inspection_when_product_changed()
    {
        $product      = $this->createProdutoSeminovo();
        $order        = $this->createOrder(['status' => 1], $product->sku);
        $orderProduct = $order->produtos()->first();
        $inspection   = InspecaoTecnica::where('pedido_produtos_id', '=', $orderProduct->id)->whereNull('revisado_at')
                            ->first();

        $orderProduct->produto_sku = ($this->createProduto())->sku;
        $orderProduct->save();

        $inspection = $inspection->fresh();

        $this->assertEquals(null, $inspection);
    }

    /**
     * Testa se quando o produto de um pedido produto for alterado, e a inspecao foi revisada, desassocia
     *
     * @return void
     */
    public function test__it_should_detach_reviewed_inspection_when_product_changed()
    {
        $product      = $this->createProdutoSeminovo();
        $order        = $this->createOrder(['status' => 1], $product->sku);
        $orderProduct = $order->produtos()->first();
        $inspection   = InspecaoTecnica::where('pedido_produtos_id', '=', $orderProduct->id)
                            ->first();

        $inspection->revisado_at = date('Y-m-d H:i:s');
        $inspection->save();

        $orderProduct->produto_sku = ($this->createProduto())->sku;
        $orderProduct->save();

        $inspection = $inspection->fresh();

        $this->assertEquals(null, $inspection->pedido_produtos_id);
    }

    /**
     * Testa se quando o pedido produto for excluido e tiver uma inspecao revisada, desassocia ela
     *
     * @return void
     */
    public function test__it_should_detach_reviewed_inspection_when_order_product_is_deleted()
    {
        $product      = $this->createProdutoSeminovo();
        $order        = $this->createOrder(['status' => 1], $product->sku);
        $orderProduct = $order->produtos()->first();
        $inspection   = InspecaoTecnica::where('pedido_produtos_id', '=', $orderProduct->id)
                            ->first();

        $inspection->revisado_at = date('Y-m-d H:i:s');
        $inspection->save();

        $orderProduct->delete();
        $inspection = $inspection->fresh();

        $this->assertEquals(null, $inspection->pedido_produtos_id);
    }

    /**
     * Testa se quando o pedido produto for excluido e tiver uma inspecao nao revisada, exclui ela
     *
     * @return void
     */
    public function test__it_should_delete_non_reviewed_inspection_when_order_product_is_deleted()
    {
        $product      = $this->createProdutoSeminovo();
        $order        = $this->createOrder(['status' => 1], $product->sku);
        $orderProduct = $order->produtos()->first();
        $inspection   = InspecaoTecnica::where('pedido_produtos_id', '=', $orderProduct->id)->whereNull('revisado_at')
                            ->first();

        $orderProduct->delete();
        $inspection = $inspection->fresh();

        $this->assertEquals(null, $inspection);
    }
}