<?php

use Illuminate\Database\Seeder;

include 'PermissionTableSeeder.php';
include 'DepotSeeder.php';

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call('PermissionTableSeeder');
        $this->call('DepotTableSeeder');
    }
}
