<?php namespace Core\Events\Handlers;

use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\Log;
use Core\Events\ProductSerialIssueDeleted;
use Core\Events\ProductSerialDefectDeleted;

class RestoreProductSerial
{
    /**
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
            ProductSerialDefectDeleted::class,
            '\Core\Events\Handlers\RestoreProductSerial@onProductSerialDefectDeleted'
        );
    }

    /**
     * @param  ProductSerialIssueDeleted $event
     * @return void
     */
    public function onProductSerialIssueDeleted(ProductSerialIssueDeleted $event)
    {
        $productSerialIssue = $event->productSerialIssue;

        try {
            $productSerialIssue->productSerial->restore();
        } catch (Exception $exception) {
            Log::warning(logMessage($e, 'RestoreProductSerial@onProductSerialIssueDeleted'));
        }
    }

    /**
     * @param  ProductSerialDefectDeleted $event
     * @return void
     */
    public function onProductSerialDefectDeleted(ProductSerialDefectDeleted $event)
    {
        $productSerialDefect = $event->productSerialDefect;

        try {
            $productSerialDefect->productSerial->restore();
        } catch (Exception $exception) {
            Log::warning(logMessage($e, 'RestoreProductSerial@onProductSerialDefectDeleted'));
        }
    }
}
