<?php namespace Tests\Core\Order\Nota;

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;
use Tests\CreateUsuario;
use Tests\Core\Create\Product\ProductImei;
use Tests\Core\Create\Order\Nota\Devolucao;
use Tests\Core\Create\Stock\Removal;
use Core\Models\Produto\Defect as DefectModel;
use Core\Models\Stock\Removal as RemovalModel;
use Core\Models\Stock\RemovalProduct as RemovalProductModel;

class DevolucaoTest extends TestCase
{
    use WithoutMiddleware,
        DatabaseTransactions;

    public function setUp()
    {
        parent::setUp();

        $this->imei1 = ProductImei::create();
        $this->imei2 = ProductImei::create();

        $this->data = [
            'cancelOrder' => true,
            'products' => [
                [
                    'sku'    => $this->imei1->productStock->product_sku,
                    'imei'   => $this->imei1->imei,
                    'defect' => true,
                    'desc'   => 'whatever',
                ],
                [
                    'sku'    => $this->imei2->productStock->product_sku,
                    'imei'   => $this->imei2->imei,
                    'defect' => false,
                    'desc'   => null,
                ],
            ]
        ];
    }

    /**
     * If can send info after devolution withou errors
     */
    public function test__it_can_proceed_upload()
    {
        $devolucao = Devolucao::create();

        $this->json('POST', "/api/notas/devolucao/proceed/{$devolucao->id}", $this->data)
            ->seeStatusCode(200)
            ->seeJson([
                'data' => true
            ]);
    }

    /**
     * If it will be create stock removals
     */
    public function test__it_should_be_create_stock_removals()
    {
        $devolucao = Devolucao::create();

        $this->json('POST', "/api/notas/devolucao/proceed/{$devolucao->id}", $this->data);

        #TODO: verificar usuario
        $this->seeInDatabase('stock_removals', [
            'is_continuous' => true
        ]);

        $products = RemovalProductModel
            ::whereIn('product_imei_id', [$this->imei1->id, $this->imei2->id])
            ->where('status', '=', 1)
            ->count();

        $this->assertEquals(2, $products);
    }

    /**
     * If it will be use existent stock removal
     */
    public function test__it_should_be_use_existent_stock_removal()
    {
        $devolucao = Devolucao::create();
        $removal   = Removal::create([
            'user_id'       => null,
            'is_continuous' => true,
            'closed_at'     => null,
        ]);

        $this->json('POST', "/api/notas/devolucao/proceed/{$devolucao->id}", $this->data);

        $product = RemovalProductModel
            ::where('product_imei_id', '=', $this->imei1->id)
            ->first();

        $this->assertEquals($removal->id, $product->removal->id);
    }

    /**
     * If invoice order cancel
     */
    public function test__it_should_be_cancel_order()
    {
        $devolucao = Devolucao::create();

        $this->json('POST', "/api/notas/devolucao/proceed/{$devolucao->id}", $this->data);

        $order = $devolucao->nota->pedido;
        $order->fresh();

        $this->assertEquals(5, $order->status);
    }

    /**
     * If invoice order wont cancel
     */
    public function test__it_wont_be_cancel_order()
    {
        $devolucao = Devolucao::create();

        $oldStatus = $devolucao->nota->pedido->status;

        $this->json('POST', "/api/notas/devolucao/proceed/{$devolucao->id}", array_merge(
            $this->data,
            [
                'cancelOrder' => false,
            ]
        ));

        $order = $devolucao->nota->pedido;
        $order->fresh();

        $this->assertEquals($oldStatus, $order->status);
    }

    /**
     * If product defect is created
     */
    public function test__it_should_be_create_product_defect()
    {
        $devolucao = Devolucao::create();

        $this->json('POST', "/api/notas/devolucao/proceed/{$devolucao->id}", $this->data);

        $defects = DefectModel
            ::whereIn('product_imei_id', [$this->imei1->id, $this->imei2->id])
            ->count();

        $product = $this->data['products'][0];

        $this->seeInDatabase('product_defects', [
            'product_sku'     => $product['sku'],
            'product_imei_id' => $this->imei1->id,
            'description'     => $product['desc'],
        ]);
    }
}
