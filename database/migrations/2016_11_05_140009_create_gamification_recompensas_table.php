
<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGamificationRecompensasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('gamification_recompensas', function(Blueprint $table) {
            $table->increments('id');
            $table->string('titulo');
            $table->integer('valor')->unsigned()->default(1);
            $table->integer('nivel')->unsigned()->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('gamification_recompensas');
    }
}
