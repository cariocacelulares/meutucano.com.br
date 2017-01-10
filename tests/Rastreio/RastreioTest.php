<?php namespace Tests\Rastreio;

use VCR\VCR;
use Tests\TestCase;
use MailThief\Testing\InteractsWithMail;
use Rastreio\Http\Controllers\RastreioController;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\Core\CreateFaturamentoCodigo;

class RastreioTest extends TestCase
{
    use WithoutMiddleware,
        DatabaseTransactions,
        InteractsWithMail,
        CreateFaturamentoCodigo,
        CreateRastreio;

    public function setUp()
    {
        parent::setUp();

        $this->rastreio = $this->createRastreio();
    }

    /**
    * Testa se é possível atualizar o status do rastreio pelos correios
    *
    * @return void
    * @vcr rastreio.refresh.yml
    */
    public function test__it_should_be_able_to_refresh_status()
    {
        /*$this->json('PUT', "/api/rastreios/refresh_status/{$this->rastreio->id}")
            ->seeStatusCode(200);

        $this->rastreio = $this->rastreio->fresh();

        $this->assertEquals(4, $this->rastreio->status);*/
    }

    /**
    * Testa se gera uma imagem do rastreio ao chegar em um status final
    *
    * @return void
    * @vcr rastreio.screenshot.yml
    */
    public function test__it_should_be_able_to_generate_screenshot()
    {
        /*$this->json('PUT', "/api/rastreios/refresh_status/{$this->rastreio->id}")
            ->seeStatusCode(200);

        $this->rastreio = $this->rastreio->fresh();

        $this->json('GET', "/api/rastreios/historico/{$this->rastreio->id}")
            ->seeStatusCode(200);

        $this->assertFileExists(storage_path('app/public/rastreio/') . $this->rastreio->rastreio . '.jpg');*/
    }

    /**
    * Testa se é possível calcular o prazo de um rastreio
    *
    * @return void
    * @vcr rastreio.deadline.yml
    */
    public function test__it_should_be_able_to_calculate_deadline()
    {
        /*$deadline = RastreioController::deadline($this->rastreio->rastreio, '89160216');

        $this->assertGreaterThanOrEqual(1, $deadline);*/
    }

    public function test__it_should_attach_rastreio_to_new_paid_order()
    {
        $this->generateFaturamentoCodigo();

        $pedido = $this->createOrder([
            'status' => 1
        ]);

        $this->seeInDatabase('pedido_rastreios', [
            'pedido_id' => $pedido->id,
        ]);
    }

    public function test__it_should_attach_rastreio_on_order_paid()
    {
        $this->generateFaturamentoCodigo();

        $pedido = $this->createOrder([
            'status' => 0
        ]);

        $pedido->status = 1;
        $pedido->save();

        $pedido = $pedido->fresh();

        $this->seeInDatabase('pedido_rastreios', [
            'pedido_id' => $pedido->id,
        ]);
    }

    public function test__it_should_attach_rastreio_with_correct_shipment_service()
    {
        $this->generateFaturamentoCodigo();

        $pedido = $this->createOrder([
            'status' => 1
        ]);

        $this->assertEquals($pedido->frete_metodo, $pedido->rastreio->servico);
    }
}
