<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMarketplacesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('marketplaces', function($table) {
            $table->string('slug', 100);
            $table->string('title', 100);
            $table->string('service', 50)->nullable();
            $table->primary('slug');
        });

        $data = [
            [
                'slug'     => 'magento',
                'title'    => 'Magento',
                'service'  => 'magento',
            ],
            [
                'slug'     => 'mercadolivre',
                'title'    => 'Mercado Livre',
                'service'  => null,
            ],
            [
                'slug'     => 'cnova',
                'title'    => 'CNOVA',
                'service'  => null,
            ],
            [
                'slug'     => 'b2w',
                'title'    => 'B2W',
                'service'  => null,
            ],
            [
                'slug'     => 'walmart',
                'title'    => 'Walmart',
                'service'  => null,
            ],
            [
                'slug'     => 'venda-direta',
                'title'    => 'Venda física',
                'service'  => null,
            ],
            [
                'slug'     => 'outro',
                'title'    => 'Outro',
                'service'  => null,
            ],
        ];

        \DB::table('marketplaces')->insert($data);

        \DB::table('orders')->where('marketplace', 'Site')
            ->update(['marketplace' => 'magento']);

        \DB::table('orders')->where('marketplace', 'MERCADOLIVRE')
            ->update(['marketplace' => 'mercadolivre']);

        \DB::table('orders')->where('marketplace', 'CNOVA')
            ->update(['marketplace' => 'cnova']);

        \DB::table('orders')->where('marketplace', 'B2W')
            ->update(['marketplace' => 'b2w']);

        \DB::table('orders')->where('marketplace', 'GROUPON')
            ->update(['marketplace' => 'outro']);

        \DB::table('orders')->where('marketplace', 'Venda direta')
            ->update(['marketplace' => 'venda-direta']);

        \DB::table('orders')->where('marketplace', 'WALMART')
            ->update(['marketplace' => 'walmart']);

        Schema::table('orders', function($table) {
            $table->renameColumn('marketplace', 'marketplace_slug');
        });

        Schema::table('orders', function($table) {
            $table->string('marketplace_slug', 100)->nullable()->change();
        });

        Schema::table('orders', function($table) {
            $table
                ->foreign('marketplace_slug')
                ->references('slug')
                ->on('marketplaces')
                ->onDelete('SET NULL')
                ->onUpdate('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
