<?php

use Illuminate\Database\Seeder;

include 'PermissionTableSeeder.php';
include 'DepotSeeder.php';
include 'ShipmentMethodTableSeeder.php';

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call('ShipmentMethodTableSeeder');
        $this->call('PermissionTableSeeder');
        $this->call('DepotTableSeeder');
    }
}
