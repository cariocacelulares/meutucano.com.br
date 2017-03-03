<?php namespace Core\Events\Handlers;

use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\Log;
use Core\Events\StockIssueCreated;
use Core\Events\DefectCreated;

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

        $events->listen(
            DefectCreated::class,
            '\Core\Events\Handlers\DeleteProductImei@onDefectCreated'
        );
    }

    /**
     * Handle the event.
     *
     * @param  StockIssueCreated $event
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

    /**
     * Handle the event.
     *
     * @param  DefectCreated $event
     * @return void
     */
    public function onDefectCreated(DefectCreated $event)
    {
        Log::debug('Handler DeleteProductImei/onDefectCreated acionado!', [$event]);
        $defect = $event->defect;

        try {
            $defect->productImei->delete();
        } catch (Exception $exception) {
            Log::warning('Ocorreu um erro ao excluir imei (DeleteProductImei/onDefectCreated/onStockIssueCreated)', [$defect]);
        }
    }
}
