<?php

use Illuminate\Database\Seeder;

include 'PermissionTableSeeder.php';

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call('PermissionTableSeeder');
    }
}
