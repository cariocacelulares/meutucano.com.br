<?php

use Illuminate\Database\Seeder;
use Core\Models\Stock;

class DepotTableSeeder extends Seeder
{
    public function run()
    {
        Stock::insert([
            'slug'     => 'default',
            'title'    => 'Estoque físico',
            'priority' => 0,
            'include'  => 1
        ]);
    }
}
