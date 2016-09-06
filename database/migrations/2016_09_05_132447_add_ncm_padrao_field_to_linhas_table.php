<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddNcmPadraoFieldToLinhasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('linhas', function (Blueprint $table) {
            $table->integer('ncm_padrao')->nullable()->default(null)->after('titulo');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('linhas', function (Blueprint $table) {
            $table->dropColumn(['ncm_padrao']);
        });
    }
}
