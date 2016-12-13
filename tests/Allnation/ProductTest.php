<?php namespace Tests\Allnation;

use VCR\VCR;
use Tests\TestCase;
use Allnation\Models\AllnationProduct;
use Allnation\Http\Services\AllnationApi;
use App\Http\Controllers\Auth\AuthenticateController;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Allnation\Http\Controllers\AllnationProductController;

class ProductTest extends TestCase
{
    use DatabaseMigrations,
        DatabaseTransactions;

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
        VCR::insertCassette('allnation.product.import');

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
     * Test if magento product is being created
     *
     * @return void
     */
    public function test__it_should_create_product_on_magento()
    {

    }

    /**
     * Test if tucano product is being created
     *
     * @return void
     */
    public function test__it_should_create_product_on_tucano()
    {

    }

    /**
     * Test if user can associate tucano product with allnation product
     *
     * @return void
     */
    public function test__it_should_be_able_to_associate_tucano_with_allnation_product()
    {

    }
}
