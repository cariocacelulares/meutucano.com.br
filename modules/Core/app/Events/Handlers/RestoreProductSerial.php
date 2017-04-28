<?php namespace Core\Events\Handlers;

use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\Log;
use Core\Events\ProductSerialIssueDeleted;
use Core\Events\ProductDefectDeleted;

class RestoreProductSerial
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
            ProductSerialIssueDeleted::class,
            '\Core\Events\Handlers\RestoreProductSerial@onProductSerialIssueDeleted'
        );

        $events->listen(
            ProductDefectDeleted::class,
            '\Core\Events\Handlers\RestoreProductSerial@onProductDefectDeleted'
        );
    }

    /**
     * Handle the event.
     *
     * @param  ProductSerialIssueDeleted $event
     * @return void
     */
    public function onProductSerialIssueDeleted(ProductSerialIssueDeleted $event)
    {
        Log::debug('Handler RestoreProductSerial/onProductSerialIssueDeleted acionado!', [$event]);
        $issue = $event->issue;

        try {
            $issue->serial->restore();
        } catch (Exception $exception) {
            Log::warning('Ocorreu um erro ao restaurar serial (RestoreProductSerial/onProductSerialIssueDeleted/onProductSerialIssueDeleted)', [$issue]);
        }
    }

    /**
     * Handle the event.
     *
     * @param  ProductDefectDeleted $event
     * @return void
     */
    public function onProductDefectDeleted(ProductDefectDeleted $event)
    {
        Log::debug('Handler RestoreProductSerial/onProductDefectDeleted acionado!', [$event]);
        $defect = $event->defect;

        try {
            $defect->serial->restore();
        } catch (Exception $exception) {
            Log::warning('Ocorreu um erro ao restaurar serial (RestoreProductSerial/onProductDefectDeleted/onProductSerialIssueDeleted)', [$defect]);
        }
    }
}
