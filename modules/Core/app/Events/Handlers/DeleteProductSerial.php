<?php namespace Core\Events\Handlers;

use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\Log;
use Core\Events\ProductDefectCreated;
use Core\Events\ProductSerialIssueCreated;

class DeleteProductSerial
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
            ProductSerialIssueCreated::class,
            '\Core\Events\Handlers\DeleteProductImei@onProductSerialIssueCreated'
        );

        $events->listen(
            ProductDefectCreated::class,
            '\Core\Events\Handlers\DeleteProductImei@onProductDefectCreated'
        );
    }

    /**
     * Handle the event.
     *
     * @param  ProductSerialIssueCreated $event
     * @return void
     */
    public function onProductSerialIssueCreated(ProductSerialIssueCreated $event)
    {
        Log::debug('Handler DeleteProductImei/onProductSerialIssueCreated acionado!', [$event]);
        $issue = $event->issue;

        try {
            $issue->serial->delete();
        } catch (Exception $exception) {
            Log::warning('Ocorreu um erro ao excluir serial (DeleteProductImei/onProductSerialIssueCreated/onProductSerialIssueCreated)', [$issue]);
        }
    }

    /**
     * Handle the event.
     *
     * @param  ProductDefectCreated $event
     * @return void
     */
    public function onProductDefectCreated(ProductDefectCreated $event)
    {
        Log::debug('Handler DeleteProductImei/onProductDefectCreated acionado!', [$event]);
        $defect = $event->defect;

        try {
            $defect->serial->delete();
        } catch (Exception $exception) {
            Log::warning('Ocorreu um erro ao excluir serial (DeleteProductImei/onProductDefectCreated/onProductSerialIssueCreated)', [$defect]);
        }
    }
}
