<?php

use Illuminate\Database\Seeder;
use Core\Models\Depot;

class DepotTableSeeder extends Seeder
{
    public function run()
    {
        Depot::insert([
            'slug'     => 'default',
            'title'    => 'Estoque físico',
            'priority' => 0,
            'include'  => 1
        ]);
    }
}
