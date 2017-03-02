<?php namespace Core\Events\Handlers;

use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\Log;
use Core\Events\StockIssueCreated;

class DeleteProductImei
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
            StockIssueCreated::class,
            '\Core\Events\Handlers\DeleteProductImei@onStockIssueCreated'
        );
    }

    /**
     * Handle the event.
     *
     * @param  StockIssueCreated  $event
     * @return void
     */
    public function onStockIssueCreated(StockIssueCreated $event)
    {
        Log::debug('Handler DeleteProductImei/onStockIssueCreated acionado!', [$event]);
        $issue = $event->issue;

        try {
            $issue->productImei->delete();
        } catch (Exception $exception) {
            Log::warning('Ocorreu um erro ao excluir imei (DeleteProductImei/onStockIssueCreated/onStockIssueCreated)', [$issue]);
        }
    }
}
