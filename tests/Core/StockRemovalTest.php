<?php namespace Tests\Core;

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;
use Tests\CreateUsuario;
use Tests\Core\Create\Removal;
use Tests\Core\Create\RemovalProduct;
use Tests\Core\Create\ProductImei;

class StockRemovalTest extends TestCase
{
    use WithoutMiddleware,
        DatabaseTransactions;

    /**
     * If can create stock removal via api
     * @return void
     */
    public function test__it_should_be_able_to_create_stock_removal()
    {
        $user         = CreateUsuario::create();
        $productImei1 = ProductImei::create();
        $productImei2 = ProductImei::create();

        $data = [
            'user_id'          => $user->id,
            'removal_products' => [
                [
                    'product_imei_id'  => $productImei1->id,
                    'product_stock_id' => $productImei1->product_stock_id,
                ],
                [
                    'product_imei_id'  => $productImei2->id,
                    'product_stock_id' => $productImei2->product_stock_id,
                ]
            ]
        ];

        $this->json('POST', '/api/estoque/retirada', $data)
            ->seeStatusCode(201)
            ->seeJsonStructure([
                'data' => [
                    'id',
                    'user_id',
                ]
            ]);
    }

    /**
     * If can close stock removal when products was status 2 and 3
     * @return void
     */
    public function test__it_should_be_able_to_close_stock_removal_when_products_status_is_back_or_sent()
    {
        $removal = Removal::create();

        // enviado
        RemovalProduct::create([
            'stock_removal_id' => $removal->id,
            'status'           => 2,
        ]);

        // devolvido
        RemovalProduct::create([
            'stock_removal_id' => $removal->id,
            'status'           => 3,
        ]);

        $this->json('POST', "/api/estoque/retirada/fechar/{$removal->id}")
            ->seeStatusCode(200);
    }

    /**
     * If block to close stock removal when has product with status 1
     * @return void
     */
    public function test__it_should_be_block_close_stock_removal_when_has_product_confirmed()
    {
        $removal = Removal::create();

        // enviado
        RemovalProduct::create([
            'stock_removal_id' => $removal->id,
            'status'           => 2,
        ]);

        // confirmado
        RemovalProduct::create([
            'stock_removal_id' => $removal->id,
            'status'           => 1,
        ]);

        $this->json('POST', "/api/estoque/retirada/fechar/{$removal->id}")
            ->seeStatusCode(400)
            ->seeJson([
                'status' => 'ValidationFail'
            ]);
    }

    /**
     * If block to close stock removal when has product with status 0
     * @return void
     */
    public function test__it_should_be_block_close_stock_removal_when_has_product_withdrawn()
    {
        $removal = Removal::create();

        // enviado
        RemovalProduct::create([
            'stock_removal_id' => $removal->id,
            'status'           => 2,
        ]);

        // retirado
        RemovalProduct::create([
            'stock_removal_id' => $removal->id,
            'status'           => 0,
        ]);

        $this->json('POST', "/api/estoque/retirada/fechar/{$removal->id}")
            ->seeStatusCode(400)
            ->seeJson([
                'status' => 'ValidationFail'
            ]);
    }
}
