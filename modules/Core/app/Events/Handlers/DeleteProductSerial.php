<?php namespace Core\Events\Handlers;

use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\Log;
use Core\Events\ProductSerialIssueCreated;
use Core\Events\ProductSerialDefectCreated;

class DeleteProductSerial
{
    /**
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
     * @param  ProductSerialIssueCreated $event
     * @return void
     */
    public function onProductSerialIssueCreated(ProductSerialIssueCreated $event)
    {
        $productSerialIssue = $event->productSerialIssue;

        try {
            $productSerialIssue->productSerial->delete();
        } catch (Exception $e) {
            Log::warning(logMessage($e, 'DeleteProductSerial@onProductSerialIssueCreated'));
        }
    }

    /**
     * @param  ProductSerialDefectCreated $event
     * @return void
     */
    public function onProductSerialDefectCreated(ProductSerialDefectCreated $event)
    {
        $productSerialDefect = $event->productSerialDefect;

        try {
            $productSerialDefect->productSerial->delete();
        } catch (Exception $e) {
            Log::warning(logMessage($e, 'DeleteProductSerial@onProductSerialDefectCreated'));
        }
    }
}
