<?php namespace Core\Jobs;

use Illuminate\Bus\Queueable;
use Core\Models\OrderShipment;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Core\Http\Controllers\Order\OrderShipmentController;

class CalculateDeadline implements ShouldQueue
{
    use Queueable,
        SerializesModels,
        InteractsWithQueue;

    /**
     * @var OrderShipment
     */
    protected $orderShipment;

    /**
     * @return void
     */
    public function __construct(OrderShipment $orderShipment)
    {
        $this->orderShipment = $orderShipment;
    }

    /**
     * @return void
     */
    public function handle()
    {
        OrderShipmentController::calculateDeadline($this->orderShipment->id);
    }

    /**
     * The job failed to process.
     *
     * @param  Exception  $exception
     * @return void
     */
    public function failed(\Exception $e)
    {
        \Log::critical(logMessage($e, '\Core\Jobs\CalculateDeadline'));
    }
}
