<?php namespace Tests\Core\Order;

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use MailThief\Testing\InteractsWithMail;
use Tests\TestCase;
use Tests\Core\Create\Order\Nota;

class NotaTest extends TestCase
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
