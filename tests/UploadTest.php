<?php namespace Tests;

use App\Models\Cliente;
use App\Models\ClienteEndereco;
use App\Models\Pedido;
use App\Models\PedidoImposto;
use App\Models\PedidoNota;
use App\Models\PedidoProduto;
use App\Models\PedidoRastreio;

class UploadTest extends TestCase
{
    /**
     * Test if upload is working and saving on database
     *
     * @return void
     */
    public function test__it_should_persist_data_when_file_uploaded()
    {
        $this->post('/api/upload?usuario=1&token='  . $this->userToken, [
            'test' => true,
            'file' => [
                'testNota.xml'
            ]
        ])->seeJson([
            'code'   => 201,
            'status' => 'success'
        ]);

        $this->seeInDatabase(with(new Cliente())->getTable(), ['taxvat' => 43726887687]);
        $this->seeInDatabase(with(new ClienteEndereco())->getTable(), ['cep' => 36070630]);
        $this->seeInDatabase(with(new Pedido())->getTable(), ['id' => 198841]);
        $this->seeInDatabase(with(new PedidoNota())->getTable(), ['pedido_id' => 198841]);
        $this->seeInDatabase(with(new PedidoRastreio())->getTable(), ['pedido_id' => 198841]);
        $this->seeInDatabase(with(new PedidoImposto())->getTable(), ['pedido_id' => 198841]);
        $this->seeInDatabase(with(new PedidoProduto())->getTable(), ['pedido_id' => 198841]);
    }
}
