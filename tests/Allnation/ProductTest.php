<?php namespace Tests\Allnation;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Allnation\Http\Controllers\AllnationProductController;
use VCR\VCR;
use App\Http\Controllers\Auth\AuthenticateController;
use Allnation\Models\AllnationProduct;
use Allnation\Http\Services\AllnationApi;
use Tests\TestCase;
use Tests\Core\CreateProduto;

class ProductTest extends TestCase
{
    use DatabaseTransactions;

    /**
     * Test if products can be imported from Allnation API
     *
     * @return void
     */
    public function test__it_should_import_products()
    {
        \T::shouldReceive('set')
            ->once();

        \T::shouldReceive('get')
            ->once()
            ->with('allnation.product.lastrequest')
            ->andReturn('2016-12-05 00:00:00');

        $apiService = new AllnationApi;

        VCR::turnOn();
        VCR::insertCassette('allnation.product.import.yml');

        $response = with(new AllnationProductController)->fetchProducts($apiService);

        VCR::eject();
        VCR::turnOff();

        $this->seeInDatabase('allnation_products', [
            'id' => 46898
        ]);
    }

    /**
     * Test if user can list allnation products
     *
     * @return void
     */
    public function test__it_should_be_able_to_list_allnation_products()
    {
        factory(AllnationProduct::class)->create();

        $this->json('GET', "/api/allnation/products/list")
            ->seeJsonContains(['total' => 1])
            ->seeStatusCode(200);
    }

    /**
     * Test if user can edit allnation products
     *
     * @return void
     */
    public function test__it_should_be_able_to_edit_allnation_products()
    {
        $product = factory(AllnationProduct::class)->create();

        $this->json('PUT', "/api/allnation/products/{$product->id}", [
            'title' => 'Edited product'
        ])->seeStatusCode(200);

        $this->seeInDatabase('allnation_products', [
            'id'    => $product->id,
            'title' => 'Edited product'
        ]);
    }

    /**
     * Test if new stock information can be imported
     *
     * @return void
     */
    public function test__it_should_be_able_to_import_stocks()
    {
        $product = CreateProduto::create([
            'sku' => 9999
        ]);

        $productAllNation = factory(AllnationProduct::class)->create([
            'id'          => 28001,
            'produto_sku' => $product->sku
        ]);

        \T::shouldReceive('set')
            ->once();

        \T::shouldReceive('get')
            ->once()
            ->with('allnation.stock.lastrequest')
            ->andReturn('2017-01-16 16:00:00');

        $apiService = new AllnationApi;

        VCR::turnOn();
        VCR::insertCassette('allnation.stock.import.yml');

        $response = with(new AllnationProductController)->fetchStocks($apiService);

        VCR::eject();
        VCR::turnOff();

        $this->seeInDatabase('product_stocks', [
            'product_sku' => 9999,
            'stock_slug'  => 'allnation',
            'quantity'    => 100
        ]);
    }
}
