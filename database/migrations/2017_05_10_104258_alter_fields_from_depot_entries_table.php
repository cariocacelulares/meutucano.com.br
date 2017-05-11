<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterFieldsFromDepotEntriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('depot_entries', function($table) {
            $table->decimal("discount", 10)->default(0)->after('supplier_id');
            $table->decimal("taxes", 10)->default(0)->after('supplier_id');
            $table->tinyInteger("installments")->default(1)->after('supplier_id');
            $table->string("payment_method")->default('boleto')->after('supplier_id');
            $table->decimal("shipment_cost", 10)->default(0)->after('supplier_id');
            $table->string("shipment_method")->default('transportadora')->after('supplier_id');
        });

        Schema::table('depot_entry_products', function($table) {
            $table->dropColumn(['total_value']);
            $table->boolean('taxed')->default(1)->after('unitary_value');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
    }
}
