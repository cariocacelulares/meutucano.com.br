<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class SetOpcoesFieldNullableInLinhaAtributosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('linha_atributos', function (Blueprint $table) {
            $table->text('opcoes')->after('tipo')->nullable()->default(null)->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('linha_atributos', function (Blueprint $table) {
            $table->text('opcoes')->after('tipo')->nullable(false)->change();
        });
    }
}
