<?php namespace Core\Events\Handlers;

use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\Log;
use Core\Events\EntryConfirmed;
use Core\Models\Produto\ProductImei;
use Core\Models\Stock\Entry\Imei;

class ConvertEntryImeis
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
            EntryConfirmed::class,
            '\Core\Events\Handlers\ConvertEntryImeis@onEntryConfirmed'
        );
    }

    /**
     * Handle the event.
     *
     * @param  EntryConfirmed $event
     * @return void
     */
    public function onEntryConfirmed(EntryConfirmed $event)
    {
        Log::debug('Handler ConvertEntryImeis/onEntryConfirmed acionado!', [$event]);
        $entry = $event->entry;

        try {
            // Abre um transaction no banco de dados
            \DB::beginTransaction();
            Log::debug('Transaction - begin');

            foreach ($entry->products as $product) {
                $imeis = $product->getOriginal('imeis');

                if (!$imeis) {
                    continue;
                }

                $imeis = json_decode($imeis);

                foreach ($imeis as $imei) {
                    $attrs = [
                        'imei' => $imei
                    ];

                    $imei = ProductImei
                        ::where($attrs)
                        ->withTrashed()->first() ?: ProductImei::create(array_merge($attrs, [
                            'product_stock_id' => $product->product_stock_id,
                        ]));

                    if (!$imei->wasRecentlyCreated && !is_null($imei->deleted_at)) {
                        $imei->restore();
                    }

                    if ($imei->product_stock_id != $product->product_stock_id) {
                        $imei->product_stock_id = $product->product_stock_id;
                        $imei->save();
                    }

                    $entryImei = Imei::create([
                        'stock_entry_product_id' => $product->id,
                        'product_imei_id'        => $imei->id,
                    ]);

                    Log::info("Relação {$entryImei->id} criada entre o imei {$imei->id} [{$imei->imei}] e o produto {$product->id} da entrada {$entry->id}");
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

            Log::warning(logMessage($exception, 'Ocorreu um erro ao transferir imeis (ConvertEntryImeis/onEntryConfirmed/onEntryConfirmed)'), [$entry]);
        }
    }
}
