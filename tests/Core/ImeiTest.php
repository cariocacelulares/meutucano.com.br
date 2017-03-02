<?php namespace Tests\Core;

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class ImeiTest extends TestCase
{
    use WithoutMiddleware,
        DatabaseTransactions;

    /**
     * Test if PDF can be generated
     * @return void
     */
    public function test__it_should_be_able_to_generate_pdf()
    {
        $response = $this->json('GET', '/api/estoque/imei/generate?listSize=24')
            ->seeStatusCode(201);

        $response = $response->response->getData()->data;

        $this->assertFileExists(storage_path("app/public/{$response->path}/{$response->fileName}"));
    }

    /**
     * Test if config value is being incremented when pdf is generated
     *
     * @return void
     */
    public function test__it_should_increment_config_value()
    {
        \T::shouldReceive('get')
            ->once()
            ->with('core.stock.last_generated_imei')
            ->andReturn('0');

        \T::shouldReceive('set')
            ->once()
            ->with('core.stock.last_generated_imei', '24');

        $this->json('GET', '/api/estoque/imei/generate?listSize=24');
    }
}
