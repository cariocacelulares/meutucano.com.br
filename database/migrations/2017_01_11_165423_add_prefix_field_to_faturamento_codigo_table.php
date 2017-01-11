<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddPrefixFieldToFaturamentoCodigoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
		Schema::table('faturamento_codigos', function(Blueprint $table)
		{
			$table->char('prefix', 5)->after('servico');
		});
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('faturamento_codigos', function (Blueprint $table) {
            $table->dropColumn('prefix');
        });
    }
}
