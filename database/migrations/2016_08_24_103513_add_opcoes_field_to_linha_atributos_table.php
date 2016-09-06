<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddOpcoesFieldToLinhaAtributosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('linha_atributos', function (Blueprint $table) {
            $table->text('opcoes')->after('tipo');
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
            $table->dropColumn(['opcoes']);
        });
    }
}
