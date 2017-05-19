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
            '\Core\Events\Handlers\DeleteProductSerial@onProductSerialIssueCreated'
        );

        $events->listen(
            ProductSerialDefectCreated::class,
            '\Core\Events\Handlers\DeleteProductSerial@onProductSerialDefectCreated'
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
        Log::debug('Handler DeleteProductSerial/onProductSerialIssueCreated acionado!', [$event]);
        $productSerialIssue = $event->productSerialIssue;

        try {
            $productSerialIssue->productSerial->delete();
        } catch (Exception $exception) {
            Log::warning('Ocorreu um erro ao excluir serial (DeleteProductSerial/onProductSerialIssueCreated/onProductSerialIssueCreated)', [$productSerialIssue]);
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
        Log::debug('Handler DeleteProductSerial/onProductSerialDefectCreated acionado!', [$event]);
        $productSerialDefect = $event->productSerialDefect;

        try {
            $productSerialDefect->productSerial->delete();
        } catch (Exception $exception) {
            Log::warning('Ocorreu um erro ao excluir serial (DeleteProductSerial/onProductSerialDefectCreated/onProductSerialIssueCreated)', [$productSerialDefect]);
        }
    }
}
