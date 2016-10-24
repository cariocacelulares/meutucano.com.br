<?php

use Carbon\Carbon;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use App\Models\Inspecao\InspecaoTecnica;

class ReplaceImeiFieldToRevisadoAtInInspecaoTecnicaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('inspecao_tecnica', function (Blueprint $table) {
            $table->timestamp('revisado_at')->nullable()->default(null)->after('reservado');
        });

        $inspecoes = InspecaoTecnica
            ::whereNotNull('imei')
            ->get();

        foreach ($inspecoes as $inspecao) {
            if ($inspecao->imei && $inspecao->updated_at) {
                if ($inspecao->updated_at) {
                    $updated_at = Carbon::createFromFormat('d/m/Y H:i', $inspecao->updated_at)->format('Y-m-d H:i:s');
                    $inspecao->revisado_at = $updated_at;
                } else if ($inspecao->created_at) {
                    $created_at = Carbon::createFromFormat('d/m/Y H:i', $inspecao->created_at)->format('Y-m-d H:i:s');
                    $inspecao->revisado_at = $created_at;
                }

                $inspecao->save();
            }
        }

        Schema::table('inspecao_tecnica', function (Blueprint $table) {
            $table->dropColumn('imei');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('inspecao_tecnica', function (Blueprint $table) {
            $table->text('imei')->nullable()->after('produto_sku');
        });

        Schema::table('inspecao_tecnica', function (Blueprint $table) {
            $table->dropColumn('revisado_at');
        });
    }
}
