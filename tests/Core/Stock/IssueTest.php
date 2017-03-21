<?php namespace Tests\Core\Stock;

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;
use Tests\CreateUsuario;
use Tests\Core\Create\Stock\Issue;
use Tests\Core\Create\Product\ProductImei;

class IssueTest extends TestCase
{
    use WithoutMiddleware,
        DatabaseTransactions;

    /**
     * If can create stock issue via api
     * @return void
     */
    public function test__it_should_be_able_to_create_stock_issue()
    {
        $user        = CreateUsuario::create();
        $productImei = ProductImei::create();

        $data = [
            'user_id'     => $user->id,
            'imei'        => $productImei->imei,
            'reason'      => 'Outro',
            'description' => 'Caiu da janela'
        ];

        $this->json('POST', '/api/estoque/baixa', $data)
            ->seeStatusCode(201)
            ->seeJsonStructure([
                'data' => [
                    'id',
                    'user_id',
                    'product_imei_id',
                    'reason',
                    'description',
                ]
            ]);

         $this->seeInDatabase('stock_issues', [
             'user_id'         => $user->id,
             'product_imei_id' => $productImei->id,
             'reason'          => 'Outro',
             'description'     => 'Caiu da janela'
         ]);
    }

    /**
     * Test if stock decrease when issue is created, by deleting product imei
     */
    public function test__it_should_be_subtract_stock_when_create_stock_issue()
    {
        $productImei = ProductImei::create();
        $productStock = $productImei->productStock->fresh();

        $oldStock = $productStock->quantity;

        Issue::create([
            'product_imei_id' => $productImei->id
        ]);

        $productStock = $productStock->fresh();

        $this->assertEquals(($oldStock - 1), $productStock->quantity);
    }

    /**
     * Test if stock increase when issue is deleted, by restoring product imei
     */
    public function test__it_should_be_increase_stock_when_stock_issue_is_deleted()
    {
        $productImei  = ProductImei::create();
        $productStock = $productImei->productStock->fresh();

        $oldStock = $productStock->quantity;

        $issue = Issue::create([
            'product_imei_id' => $productImei->id
        ]);

        $issue->delete();

        $productStock = $productStock->fresh();

        $this->assertEquals($oldStock, $productStock->quantity);
    }
}
