<?php namespace Core\Events\Handlers;

use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\Log;
use Core\Events\StockIssueDeleted;
use Core\Events\DefectDeleted;

class RestoreProductImei
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
            StockIssueDeleted::class,
            '\Core\Events\Handlers\RestoreProductImei@onStockIssueDeleted'
        );

        $events->listen(
            DefectDeleted::class,
            '\Core\Events\Handlers\RestoreProductImei@onDefectDeleted'
        );
    }

    /**
     * Handle the event.
     *
     * @param  StockIssueDeleted $event
     * @return void
     */
    public function onStockIssueDeleted(StockIssueDeleted $event)
    {
        Log::debug('Handler RestoreProductImei/onStockIssueDeleted acionado!', [$event]);
        $issue = $event->issue;

        try {
            $issue->productImei->restore();
        } catch (Exception $exception) {
            Log::warning('Ocorreu um erro ao restaurar imei (RestoreProductImei/onStockIssueDeleted/onStockIssueDeleted)', [$issue]);
        }
    }

    /**
     * Handle the event.
     *
     * @param  DefectDeleted $event
     * @return void
     */
    public function onDefectDeleted(DefectDeleted $event)
    {
        Log::debug('Handler RestoreProductImei/onDefectDeleted acionado!', [$event]);
        $defect = $event->defect;

        try {
            $defect->productImei->restore();
        } catch (Exception $exception) {
            Log::warning('Ocorreu um erro ao restaurar imei (RestoreProductImei/onDefectDeleted/onStockIssueDeleted)', [$defect]);
        }
    }
}
