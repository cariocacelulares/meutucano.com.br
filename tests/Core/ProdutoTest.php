<?php namespace Tests\Core;

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;
use Tests\Core\Create\Pedido;
use Tests\Core\Create\Order\PedidoProduto;
use Tests\Core\Create\Produto;
use Tests\Core\Create\Stock\Entry;
use Tests\Core\Create\Stock\Entry\Imei as EntryImei;
use Tests\Core\Create\Stock\Entry\Product as EntryProduct;
use Core\Models\Produto\ProductImei as ProductImeiModel;
use Core\Http\Controllers\Stock\EntryController;

class ProdutoTest extends TestCase
{
    use WithoutMiddleware,
        DatabaseTransactions;

    /**
     * If it will be calc correct product cost
     */
    public function test__it_will_calc_correct_cost()
    {
        $product = Produto::create();

        $v1    = 200;
        $v2    = 500;
        $sells = 5;

        $imeis1 = [
            'entry1serial1',
            'entry1serial2',
            'entry1serial3',
            'entry1serial4',
            'entry1serial5',
            'entry1serial6',
            'entry1serial7',
            'entry1serial8',
            'entry1serial9',
            'entry1serial10',
        ];

        $imeis2 = [
            'entry2serial1',
            'entry2serial2',
            'entry2serial3',
            'entry2serial4',
            'entry2serial5',
        ];

        /* entry 1 */
        $entry1  = Entry::create();

        $entryProduct1 = EntryProduct::create([
            'stock_entry_id' => $entry1->id,
            'product_sku'    => $product->sku,
            'quantity'       => 10,
            'unitary_value'  => $v1,
            'imeis'          => json_encode($imeis1),
        ]);

        foreach ($imeis1 as $imei) {
            $productImei = ProductImeiModel
                ::where('imei', '=', $imei)
                ->first();

            if ($productImei) {
                EntryImei::create(
                    $entryProduct1->id,
                    $productImei->id
                );
            }
        }

        $entry1 = $entry1->fresh();
        $entry1->confirmed_at = date('Y-m-d H:i:s');
        $entry1->save();

        $order = Pedido::create([
            'status' => 1
        ]);

        // vende 5 seriais
        $i = 0;
        foreach ($imeis1 as $imei) {
            $i++;

            $productImei = ProductImeiModel
                ::where('imei', '=', $imei)
                ->first();

            if ($productImei) {
                PedidoProduto::create([
                    'pedido_id'       => $order->id,
                    'produto_sku'     => $product->sku,
                    'product_imei_id' => $productImei->id,
                ]);
            }

            if ($i == $sells) {
                break;
            }
        }

        $order = $order->fresh();
        $order->status = 3;
        $order->save();
        /* fim entry 1 */

        /* entry 2 */
        $entry2  = Entry::create();

        $entryProduct2 = EntryProduct::create([
            'stock_entry_id' => $entry2->id,
            'product_sku'    => $product->sku,
            'quantity'       => 10,
            'unitary_value'  => $v2,
            'imeis'          => json_encode($imeis2),
        ]);

        foreach ($imeis2 as $imei) {
            $productImei = ProductImeiModel
                ::where('imei', '=', $imei)
                ->first();

            if ($productImei) {
                EntryImei::create(
                    $entryProduct2->id,
                    $productImei->id
                );
            }
        }

        $entry2 = $entry2->fresh();
        $entry2->confirmed_at = date('Y-m-d H:i:s');
        $entry2->save();
        /* fim entry 2 */

        /*
         Ficaram 5 seriais da primeira entrada e 5 da segunda
         Formula:
            somatório da quantidade de imeis em estoque e em entradas confirmadas vezes o custo unitário da entrada
            dividido pelo somatório dessa quantidade
         */
        $expected = (((count($imeis1) - $sells) * $v1) + (count($imeis2) * $v2)) / 10;
        $product  = $product->fresh();

        $this->assertEquals($expected, $product->cost);
    }
}
