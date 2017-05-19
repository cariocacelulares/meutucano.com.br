<?php namespace Core\Events\Handlers;

use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\Log;
use Core\Events\DepotEntryConfirmed;
use Core\Models\ProductSerial;
use Core\Models\DepotEntryProductSerial;

class ConvertEntrySerials
{
    /**
     * Set events that this will listen
     *
     * @param  Dispatcher $events
     * @return void
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(
            DepotEntryConfirmed::class,
            '\Core\Events\Handlers\ConvertEntrySerials@onDepotEntryConfirmed'
        );
    }

    /**
     * Handle the event.
     *
     * @param  DepotEntryConfirmed $event
     * @return void
     */
    public function onDepotEntryConfirmed(DepotEntryConfirmed $event)
    {
        Log::debug('Handler ConvertEntrySerials/onDepotEntryConfirmed acionado!', [$event]);
        $entry = $event->entry;

        try {
            \DB::beginTransaction();
            Log::debug('Transaction - begin');

            foreach ($entry->products as $product) {
                $serials = $product->getOriginal('serials');

                if (!$serials) {
                    \Stock::add(
                        $product->product_sku,
                        $product->quantity,
                        $product->depotProduct->stock_slug
                    );
                } else {
                    $serials = json_decode($serials);

                    foreach ($serials as $serial) {
                        $serial = mb_strtoupper(trim($serial));

                        $serial = ProductSerial::where(['serial' => $serial])
                            ->withTrashed()->first();

                        if (!$serial) {
                            $serial = ProductSerial::create(array_merge(
                                ['serial' => $serial],
                                ['depot_product_id' => $product->depot_product_id]
                            ));
                        }

                        if ($serial->depot_product_id != $product->depot_product_id) {
                            $serial->depot_product_id = $product->depot_product_id;
                            $serial->save();
                        }

                        if (!$serial->wasRecentlyCreated && !is_null($serial->deleted_at)) {
                            $serial->restore();
                        }

                        $entryImei = DepotEntryProductSerial::firstOrCreate([
                            'stock_entry_product_id' => $product->id,
                            'product_serial_id'      => $serial->id,
                        ]);

                        Log::info("Relação {$entryImei->id} criada entre o serial {$serial->id} [{$serial->serial}] e o produto {$product->id} da entrada {$entry->id}");
                    }
                }
            }

            // Fecha a transação e comita as alterações
            \DB::commit();
            Log::debug('Transaction - commit');
        } catch (\Exception $exception) {
            \DB::rollBack();
            Log::debug('Transaction - rollback');

            $entry->confirmed_at = null;
            $entry->save();

            Log::info('Tirado confirmação de retirada de estoque: erro ao registrar seriais');

            Log::warning(logMessage($exception, 'Ocorreu um erro ao transferir serials (ConvertEntrySerials/onDepotEntryConfirmed/onDepotEntryConfirmed)'), [$entry]);
        }
    }
}
