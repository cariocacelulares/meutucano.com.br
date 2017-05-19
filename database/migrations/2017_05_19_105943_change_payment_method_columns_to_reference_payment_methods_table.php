<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangePaymentMethodColumnsToReferencePaymentMethodsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        \DB::table('orders')->whereNull('payment_method')
            ->update(['payment_method' => 'outro']);

        Schema::table('orders', function($table) {
            $table->renameColumn('payment_method', 'payment_method_slug');
        });

        Schema::table('orders', function($table) {
            $table
                ->foreign('payment_method_slug')
                ->references('slug')
                ->on('payment_methods')
                ->onDelete('SET NULL')
                ->onUpdate('CASCADE');
        });

        Schema::table('depot_entries', function($table) {
            $table->renameColumn('payment_method', 'payment_method_slug');
        });

        Schema::table('depot_entries', function($table) {
            $table->string('payment_method_slug')->nullable()->default(null)->change();
        });

        Schema::table('depot_entries', function($table) {
            $table
                ->foreign('payment_method_slug')
                ->references('slug')
                ->on('payment_methods')
                ->onDelete('SET NULL')
                ->onUpdate('CASCADE');
        });
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
