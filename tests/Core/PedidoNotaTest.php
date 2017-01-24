<?php namespace Tests\Core;

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use MailThief\Testing\InteractsWithMail;
use Tests\TestCase;
use Tests\Core\Create\Nota;

class PedidoNotaTest extends TestCase
{
    use WithoutMiddleware,
        DatabaseTransactions,
        InteractsWithMail;

    public function setUp()
    {
        parent::setUp();

        $this->invoice = Nota::create();
    }

    public function tearDown()
    {
        Nota::reset();

        parent::tearDown();
    }

    /**
    * Testa se é possível gerar o XML de uma nota fiscal
    *
    * @return void
    */
    public function test__it_should_be_able_to_generate_xml()
    {
        $response = $this->json('GET', "/api/notas/xml/{$this->invoice->id}/0")
            ->seeStatusCode(200);
    }

    /**
    * Testa se é possível gerar o DANFE da nota fiscal
    *
    * @return void
    */
    public function test__it_should_be_able_to_generate_danfe()
    {
        $response = $this->json('GET', "/api/notas/danfe/{$this->invoice->id}/S")
            ->seeStatusCode(200);
    }

    /**
    * Testa se é possível enviar e-mail ao cliente contendo a nota fiscal
    *
    * @return void
    */
    public function test__it_should_be_able_to_send_email_to_customer()
    {
        $response = $this->json('POST', "/api/notas/email/{$this->invoice->id}")
            ->seeStatusCode(200);

        $this->seeMessageFor($this->invoice->pedido->cliente->email);
        $this->assertEquals('application/pdf', $this->lastMessage()->attachments[0]['options']['mime']);
    }

    /**
    * Test if has validation when deleting invoice
    * @return void
    */
    public function test__it_should_be_validate_delete_note_on_cancel_invoice()
    {
        $invoice = Nota::create();

        $response = $this->json('DELETE', "/api/notas/{$invoice->id}")
            ->seeStatusCode(400);
    }

    /**
    * Test if can delete a invoice
    * @return void
    */
    public function test__it_should_be_able_to_delete_invoice()
    {
        $invoice = Nota::create();

        $response = $this->json('DELETE', "/api/notas/{$invoice->id}?delete_note=motivodaexclusao")
            ->seeStatusCode(204);
    }
}
