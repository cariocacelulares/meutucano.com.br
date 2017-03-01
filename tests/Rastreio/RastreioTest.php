<?php namespace Tests\Rastreio;

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use MailThief\Testing\InteractsWithMail;
use VCR\VCR;
use Rastreio\Http\Controllers\RastreioController;
use Tests\TestCase;
use Tests\Rastreio\Create\Rastreio;
use Tests\Core\Create\Pedido;

class RastreioTest extends TestCase
{
    use WithoutMiddleware,
        DatabaseTransactions,
        InteractsWithMail;

    public function setUp()
    {
        parent::setUp();

        $this->rastreio = Rastreio::create();
    }

    /**
    * Test if has validation when deleting invoice
    * @return void
    */
    public function test__it_should_be_validate_delete_note_on_cancel_invoice()
    {
        $rastreio = Rastreio::create();

        $response = $this->json('DELETE', "/api/rastreios/{$rastreio->id}")
            ->seeStatusCode(400);
    }

    /**
    * Test if can delete a invoice
    * @return void
    */
    public function test__it_should_be_able_to_delete_invoice()
    {
        $rastreio = Rastreio::create();

        $response = $this->json('DELETE', "/api/rastreios/{$rastreio->id}?delete_note=motivodaexclusao")
            ->seeStatusCode(204);
    }

    /**
    * Testa se é possível atualizar o status do rastreio pelos correios
    *
    * @return void
    * @vcr rastreio.refresh.yml
    */
    public function test__it_should_be_able_to_refresh_status()
    {
        $this->json('PUT', "/api/rastreios/refresh_status/{$this->rastreio->id}")
            ->seeStatusCode(200);

        $this->rastreio = $this->rastreio->fresh();

        $this->assertEquals(4, $this->rastreio->status);
    }

    /**
    * Testa se gera uma imagem do rastreio ao chegar em um status final
    *
    * @return void
    * @vcr rastreio.screenshot.yml
    */
    public function test__it_should_be_able_to_generate_screenshot()
    {
        $this->json('PUT', "/api/rastreios/refresh_status/{$this->rastreio->id}")
            ->seeStatusCode(200);

        $this->rastreio = $this->rastreio->fresh();

        $this->json('GET', "/api/rastreios/historico/{$this->rastreio->id}")
            ->seeStatusCode(200);

        $this->assertFileExists(storage_path('app/public/rastreio/') . $this->rastreio->rastreio . '.jpg');
    }

    /**
    * Testa se é possível calcular o prazo de um rastreio
    *
    * @return void
    * @vcr rastreio.deadline.yml
    */
    public function test__it_should_be_able_to_calculate_deadline()
    {
        $deadline = RastreioController::deadline($this->rastreio->rastreio, '89160216');

        $this->assertGreaterThanOrEqual(1, $deadline);
    }

    /**
     * Testa se um novo rastreio é criado quando um pedido é criado como pago
     */
    public function test__it_should_attach_rastreio_to_new_paid_order()
    {
        $pedido = Pedido::create([
            'status'      => 1,
            'marketplace' => 'Site',
        ]);

        $this->seeInDatabase('pedido_rastreios', [
            'pedido_id' => $pedido->id,
        ]);
    }

    /**
     * Testa se um novo rastreio é criado quando um pedido muda o status para pago
     */
    public function test__it_should_attach_rastreio_on_order_paid()
    {
        $pedido = Pedido::create([
            'status'      => 0,
            'marketplace' => 'Site',
        ]);

        $pedido->status = 1;
        $pedido->save();

        $pedido = $pedido->fresh();

        $this->seeInDatabase('pedido_rastreios', [
            'pedido_id' => $pedido->id,
        ]);
    }

    /**
     * Testa se o rastreio criado quando um pedido é criado como pago possui o serviço correto
     */
    public function test__it_should_attach_rastreio_with_correct_shipment_service()
    {
        $pedido = Pedido::create([
            'status'      => 1,
            'marketplace' => 'Site',
        ]);

        $pedido = $pedido->fresh();

        $servico = isset($pedido->rastreios[0]) ? $pedido->rastreios[0]->servico : null;

        $this->assertEquals($pedido->frete_metodo, $servico);
    }
}
