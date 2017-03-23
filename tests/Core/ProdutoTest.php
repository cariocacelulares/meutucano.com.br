<?php namespace Tests\Core;

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;
use Tests\Core\Create\Produto;
use Tests\Core\Create\Stock\Entry;
use Tests\Core\Create\Stock\Entry\Product as EntryProduct;

class ProdutoTest extends TestCase
{
    use WithoutMiddleware,
        DatabaseTransactions;

    /**
     * If it will be calc correct product cost
     */
    public function test__it_will_calc_correct_cost()
    {
        $entry1  = Entry::create();
        $product = Produto::create();

        $q1 = 3;
        $v1 = 1000;
        $q2 = 2;
        $v2 = 500;

        $entryProduct1 = EntryProduct::create([
            'stock_entry_id' => $entry1->id,
            'product_sku'    => $product->sku,
            'quantity'       => $q1,
            'unitary_value'  => $v1,
        ]);

        $entryProduct2 = EntryProduct::create([
            'stock_entry_id' => $entry1->id,
            'product_sku'    => $product->sku,
            'quantity'       => $q2,
            'unitary_value'  => $v2,
        ]);

        $entry1->confirmed_at = date('Y-m-d H:i:s');
        $entry1->save();

        $expected = (float) (($q1 * $v1) + ($q2 * $v2)) / ($q1 + $q2);

        $entry2 = Entry::create();
        EntryProduct::create([
            'stock_entry_id' => $entry2->id,
            'product_sku'    => $product->sku,
            'quantity'       => 10,
            'unitary_value'  => 5000,
        ]);

        // product entry value only sum if entry is confirmed
        // entry1 is confirmed and included in $expected cost, entry2 not

        $this->assertEquals($expected, $product->cost);
    }
}
