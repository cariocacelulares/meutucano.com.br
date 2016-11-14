<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use App\Models\Usuario\Usuario;
use App\Models\Gamification\Gamification;

class SeedGamificationTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $usuarios = Usuario::all();

        foreach ($usuarios as $usuario) {
            Gamification::create(['usuario_id' => $usuario->id]);
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        \DB::table('gamification')->truncate();
    }
}
