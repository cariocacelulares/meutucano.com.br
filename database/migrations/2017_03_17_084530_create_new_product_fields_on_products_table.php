<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateNewProductFieldsOnProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('produtos', function(Blueprint $table) {
            $table->dropColumn(['ean', 'ativo', 'referencia', 'unidade']);
        });

        Schema::table('produtos', function(Blueprint $table) {
            $table->string('ean', 20)->nullable()->after('titulo');
            $table->string('warranty', 60)->nullable()->after('estado');

            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('produtos', function(Blueprint $table) {
            $table->dropColumn([
                'ean',
                'warranty',
                'deleted_at'
            ]);
        });

        Schema::table('produtos', function(Blueprint $table) {
            $table->integer('ean')->nullable()->after('ncm');
            $table->char('unidade', 5)->nullable()->default('un')->after('valor');
            $table->string('referencia', 30)->nullable()->after('ean');
            $table->tinyInteger('ativo')->default(1)->after('unidade');
        });
    }
}
