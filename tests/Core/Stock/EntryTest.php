<?php namespace Tests\Core\Stock;

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Core\Models\Produto\ProductImei;
use Tests\TestCase;
use Tests\CreateUsuario;
use Tests\Core\Create\Supplier;
use Tests\Core\Create\Produto;
use Tests\Core\Create\Stock\Entry;
use Tests\Core\Create\Stock\Entry\Invoice;
use Tests\Core\Create\Stock\Entry\Product as EntryProduct;

class EntryTest extends TestCase
{
    use WithoutMiddleware,
    DatabaseTransactions;

    /**
    * If can create stock entry via api
    * @return void
    */
    public function test__it_should_be_able_to_create_stock_entry()
    {
        $user     = CreateUsuario::create();
        $supplier = Supplier::create();
        $product1 = Produto::create(['serial_enabled' => false]);
        $product2 = Produto::create(['serial_enabled' => true]);

        $data = [
            'user_id'      => $user->id,
            'description'  => 'A randon description',
            'confirmed_at' => null,
            'supplier'     => $supplier->toArray(),
            'invoice'      => [
                'key'      => 3517021100264500031050398700011671568772,
                'series'   => 3,
                'number'   => 123456,
                'model'    => 55,
                'cfop'     => 5102,
                'total'    => 800,
                'file'     => 'teste.xml',
                'emission' => date('d/m/Y H:i'),
            ],
            'products'     => [
                [
                    'product_sku'      => $product1->sku,
                    'product_stock_id' => $product1->productStocks[0]->id,
                    'quantity'         => 2,
                    'unitary_value'    => 200,
                    'total_value'      => 400,
                    'icms'             => 2,
                    'ipi'              => 3,
                    'pis'              => 4,
                    'cofins'           => 5,
                    'imeis'            => null,
                ],
                [
                    'product_sku'      => $product2->sku,
                    'product_stock_id' => $product2->productStocks[0]->id,
                    'quantity'         => 2,
                    'unitary_value'    => 100,
                    'total_value'      => 200,
                    'icms'             => 3,
                    'ipi'              => 4,
                    'pis'              => 5,
                    'cofins'           => 6,
                    'imeis'            => 'imeium1' . PHP_EOL . 'imeidois2',
                ],
            ],
        ];

        $this->json('POST', '/api/estoque/entrada', $data)
            ->seeStatusCode(201)
            ->seeJsonStructure([
                'data' => [
                    'id',
                    'user_id',
                    'supplier_id',
                    'description',
                    'confirmed_at',
                ]
            ]);

        $this->seeInDatabase('stock_entries', [
            'supplier_id'  => $supplier->id,
            'description'  => $data['description'],
            'confirmed_at' => $data['confirmed_at'],
        ]);

        $this->seeInDatabase('stock_entry_invoices', array_merge($data['invoice'], [
            'emission' => dateConvert("{$data['invoice']['emission']}:00", 'd/m/Y H:i:s', 'Y-m-d H:i:s'),
        ]));

        foreach ($data['products'] as $product) {
            $this->seeInDatabase('stock_entry_products', array_merge($product, [
                'imeis' => !$product['imeis'] ? null : json_encode(explode(PHP_EOL, $product['imeis']))
            ]));
        }
    }

    /**
    * If can create stock entry without invoice via api
    * @return void
    */
    public function test__it_should_be_able_to_create_stock_entry_without_invoice()
    {
        $user     = CreateUsuario::create();
        $supplier = Supplier::create();
        $product1 = Produto::create(['serial_enabled' => false]);
        $product2 = Produto::create(['serial_enabled' => true]);

        $data = [
            'user_id'      => $user->id,
            'description'  => 'A randon description',
            'confirmed_at' => null,
            'supplier'     => $supplier->toArray(),
            'products'     => [
                [
                    'product_sku'      => $product1->sku,
                    'product_stock_id' => $product1->productStocks[0]->id,
                    'quantity'         => 2,
                    'unitary_value'    => 200,
                    'total_value'      => 400,
                    'icms'             => 2,
                    'ipi'              => 3,
                    'pis'              => 4,
                    'cofins'           => 5,
                    'imeis'            => null,
                ],
                [
                    'product_sku'      => $product2->sku,
                    'product_stock_id' => $product2->productStocks[0]->id,
                    'quantity'         => 2,
                    'unitary_value'    => 100,
                    'total_value'      => 200,
                    'icms'             => 3,
                    'ipi'              => 4,
                    'pis'              => 5,
                    'cofins'           => 6,
                    'imeis'            => 'imeium1' . PHP_EOL . 'imeidois2',
                ],
            ],
        ];

        $this->json('POST', '/api/estoque/entrada', $data)
            ->seeStatusCode(201)
            ->seeJsonStructure([
                'data' => [
                    'id',
                    'user_id',
                    'supplier_id',
                    'description',
                    'confirmed_at',
                ]
            ]);

        $this->seeInDatabase('stock_entries', [
            'supplier_id'  => $supplier->id,
            'description'  => $data['description'],
            'confirmed_at' => $data['confirmed_at'],
        ]);

        foreach ($data['products'] as $product) {
            $this->seeInDatabase('stock_entry_products', array_merge($product, [
                'imeis' => !$product['imeis'] ? null : json_encode(explode(PHP_EOL, $product['imeis']))
            ]));
        }
    }

    /**
    * If can edit stock entry via api
    * @return void
    */
    public function test__it_should_be_able_to_edit_stock_entry()
    {
        $entry = Entry::create([], 2, true);

        $data = $entry->toArray();

        $data['description'] = 'Modified description';

        $data['invoice']['key'] = '38816152805945204136213659189873198829821981';
        $data['invoice']['emission'] = date('d/m/Y H:i');

        $data['supplier']['name'] = 'modified name';
        $data['supplier']['neighborhood'] = 'whatever';

        foreach ($data['products'] as $key => $value) {
            $data['products'][$key]['ncm'] = rand(1000, 9999);
        }

        $this->json('PUT', "/api/estoque/entrada/{$entry->id}", $data)
            ->seeStatusCode(200)
            ->seeJsonStructure([
                'data' => [
                    'id',
                    'user_id',
                    'supplier_id',
                    'description',
                    'confirmed_at',
                ]
            ]);

        $this->seeInDatabase('suppliers', [
            'id'           => $data['supplier']['id'],
            'company_name' => $data['supplier']['company_name'],
            'name'         => $data['supplier']['name'],
            'cnpj'         => $data['supplier']['cnpj'],
            'ie'           => $data['supplier']['ie'],
            'crt'          => $data['supplier']['crt'],
            'fone'         => $data['supplier']['fone'],
            'street'       => $data['supplier']['street'],
            'number'       => $data['supplier']['number'],
            'complement'   => $data['supplier']['complement'],
            'neighborhood' => $data['supplier']['neighborhood'],
            'city'         => $data['supplier']['city'],
            'uf'           => $data['supplier']['uf'],
            'cep'          => $data['supplier']['cep'],
            'country'      => $data['supplier']['country'],
        ]);

        $this->seeInDatabase('stock_entries', [
            'id'           => $data['id'],
            'user_id'      => $data['user_id'],
            'supplier_id'  => $data['supplier_id'],
            'description'  => $data['description'],
            'confirmed_at' => $data['confirmed_at'],
            'deleted_at'   => $data['deleted_at'],
        ]);

        $this->seeInDatabase('stock_entry_invoices', [
            'id'             => $data['invoice']['id'],
            'stock_entry_id' => $data['invoice']['stock_entry_id'],
            'key'            => $data['invoice']['key'],
            'series'         => $data['invoice']['series'],
            'number'         => $data['invoice']['number'],
            'model'          => $data['invoice']['model'],
            'cfop'           => $data['invoice']['cfop'],
            'total'          => $data['invoice']['total'],
            'file'           => $data['invoice']['file'],
        ]);

        foreach ($data['products'] as $product) {
            $this->seeInDatabase('stock_entry_products', [
                'id'               => $product['id'],
                'stock_entry_id'   => $product['stock_entry_id'],
                'product_sku'      => $product['product_sku'],
                'product_stock_id' => $product['product_stock_id'],
                'quantity'         => $product['quantity'],
                'unitary_value'    => $product['unitary_value'],
                'total_value'      => $product['total_value'],
                'icms'             => $product['icms'],
                'ipi'              => $product['ipi'],
                'pis'              => $product['pis'],
                'cofins'           => $product['cofins'],
                'imeis'            => $product['imeis'],
            ]);
        }
    }

    /**
     * If ProductImei will be created when entry is confirmed via api
     * @return void
     */
    public function test__it_should_create_imeis_when_confirm_entry()
    {
        $imeis = [
            'imeium1',
            'imeidois2',
        ];

        $user     = CreateUsuario::create();
        $supplier = Supplier::create();
        $product  = Produto::create(['serial_enabled' => true]);

        $entry = Entry::create();

        $entryProduct = EntryProduct::create([
            'stock_entry_id'   => $entry->id,
            'product_sku'      => $product->sku,
            'product_stock_id' => $product->productStocks[0]->id,
            'imeis'            => json_encode($imeis),
        ]);

        $this->json('POST', "/api/estoque/entrada/confirm/{$entry->id}")
            ->seeStatusCode(200);

        $imeis = ProductImei
            ::whereIn('imei', $imeis)
            ->count();

        $this->assertEquals(2, $imeis);
    }
}
