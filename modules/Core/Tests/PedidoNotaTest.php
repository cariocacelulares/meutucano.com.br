<?php namespace Modules\Core\Tests;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use MailThief\Testing\InteractsWithMail;

class PedidoNotaTest extends TestCase
{
  use WithoutMiddleware,
    DatabaseMigrations,
    DatabaseTransactions,
    InteractsWithMail,
    CreateNota;

  public function setUp()
  {
    parent::setUp();

    $this->nota = $this->createNota();
  }

  public function tearDown()
  {
    parent::tearDown();

    $this->resetNota();
  }

  /**
   * Testa se é possível gerar o XML de uma nota fiscal
   *
   * @return void
   */
  public function test__it_should_be_able_to_generate_xml()
  {
    $response = $this->json('GET', "/api/notas/xml/{$this->nota->id}/0")
      ->seeStatusCode(200);
  }

  /**
   * Testa se é possível gerar o DANFE da nota fiscal
   *
   * @return void
   */
  public function test__it_should_be_able_to_generate_danfe()
  {
    $response = $this->json('GET', "/api/notas/danfe/{$this->nota->id}/S")
      ->seeStatusCode(200);
  }

  /**
   * Testa se é possível enviar e-mail ao cliente contendo a nota fiscal
   *
   * @return void
   */
  public function test__it_should_be_able_to_send_email_to_customer()
  {
    $response = $this->json('POST', "/api/notas/email/{$this->nota->id}")
      ->seeStatusCode(200);

    $this->seeMessageFor($this->nota->pedido->cliente->email);
    $this->assertEquals('application/pdf', $this->lastMessage()->attachments[0]['options']['mime']);
  }

}
