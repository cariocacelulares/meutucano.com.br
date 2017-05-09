<?php namespace Core\Events\Handlers;

use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\Log;
use Core\Events\ProductSerialDefectCreated;
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
            ProductSerialDefectCreated::class,
            '\Core\Events\Handlers\DeleteProductImei@onProductSerialDefectCreated'
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
     * @param  ProductSerialDefectCreated $event
     * @return void
     */
    public function onProductSerialDefectCreated(ProductSerialDefectCreated $event)
    {
        Log::debug('Handler DeleteProductImei/onProductSerialDefectCreated acionado!', [$event]);
        $defect = $event->defect;

        try {
            $defect->serial->delete();
        } catch (Exception $exception) {
            Log::warning('Ocorreu um erro ao excluir serial (DeleteProductImei/onProductSerialDefectCreated/onProductSerialIssueCreated)', [$defect]);
        }
    }
}
