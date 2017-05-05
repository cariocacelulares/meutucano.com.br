<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeInvoicesToPolymorphicTable extends Migration
{
    /**
     * @return void
     */
    public function up()
    {
        $orderInvoices = DB::table('order_invoices')->get()->chunk(250)->toArray();

        $invoices = [];

        foreach ($orderInvoices as $oinvoices) {
            foreach ($oinvoices as $invoice) {
                $invoices[] = [
                    'invoiceable_type' => 'Core\Models\OrderInvoice',
                    'invoiceable_id' => $invoice->id,
                    'number'    => (int) substr($invoice->key, 25, 9),
                    'series'    => (int) substr($invoice->key, 34, 1),
                    'key'       => (string) $invoice->key,
                    'issued_at' => $invoice->issued_at
                ];
            }

            \Core\Models\Invoice::insert($invoices);
            $invoices = [];
        }

        $orderInvoicesDevolutions = DB::table('order_invoice_devolutions')->get();

        foreach ($orderInvoicesDevolutions as $invoice) {
            $invoices[] = [
                'invoiceable_type' => 'Core\Models\OrderInvoiceDevolution',
                'invoiceable_id' => $invoice->id,
                'number'    => (int) substr($invoice->key, 25, 9),
                'series'    => (int) substr($invoice->key, 34, 1),
                'key'       => (string) $invoice->key,
                'issued_at' => $invoice->issued_at
            ];
        }

        \Core\Models\Invoice::insert($invoices);
        $invoices = [];

        $depotEntryInvoices = DB::table('depot_entry_invoices')->get();

        foreach ($depotEntryInvoices as $invoice) {
            $invoices[] = [
                'invoiceable_type' => 'Core\Models\DepotEntryInvoice',
                'invoiceable_id' => $invoice->id,
                'number'    => (int) substr($invoice->key, 25, 9),
                'series'    => (int) substr($invoice->key, 34, 1),
                'key'       => (string) $invoice->key,
                'issued_at' => substr($invoice->emission, 0, 10)
            ];
        }

        \Core\Models\Invoice::insert($invoices);
        $invoices = [];

        Schema::table('order_invoices', function($table) {
            $table->dropColumn(['issued_at', 'key']);
        });

        Schema::table('order_invoice_devolutions', function($table) {
            $table->dropColumn(['issued_at', 'key']);
        });

        Schema::table('depot_entry_invoices', function($table) {
            $table->dropColumn(['emission', 'key', 'series', 'number', 'model', 'cfop', 'total']);
        });
    }

    /**
     * @return void
     */
    public function down()
    {
        //
    }
}
