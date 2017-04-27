<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterOtherTablesToEnglish extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::disableForeignKeyConstraints();

        Schema::rename('faturamento_codigos', 'tracking_codes');

        Schema::table('tracking_codes', function(Blueprint $table) {
            $table->renameColumn('servico', 'carrier');
            $table->renameColumn('atual', 'current');
            $table->renameColumn('fim', 'last');
        });

        Schema::table('suppliers', function(Blueprint $table) {
            $table->renameColumn('cnpj', 'taxvat');
            $table->renameColumn('uf', 'state');
            $table->renameColumn('ie', 'document');
            $table->renameColumn('fone', 'phone');
            $table->renameColumn('neighborhood', 'district');
            $table->renameColumn('cep', 'zipcode');
        });

        Schema::enableForeignKeyConstraints();
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
