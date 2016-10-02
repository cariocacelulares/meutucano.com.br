<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddCategoriaToGamificationTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('gamification', function(Blueprint $table) {
            $table->foreign('categoria_id', 'GamificationCategoria')->references('id')->on('gamification_categorias')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('gamification', function(Blueprint $table)
        {
            $table->dropForeign('GamificationCategoria');
        });
    }
}
