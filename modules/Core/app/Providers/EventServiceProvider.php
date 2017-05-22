<?php namespace Core\Providers;

use Illuminate\Support\Facades\Event;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        //
    ];

    protected $subscribe = [
        \Core\Events\Handlers\SetRefund::class,
        \Core\Events\Handlers\UpdateStock::class,
        \Core\Events\Handlers\InvoiceOrder::class,
        \Core\Events\Handlers\SetProductCost::class,
        \Core\Events\Handlers\AttachOrderShipment::class,
        \Core\Events\Handlers\DeleteProductSerial::class,
        \Core\Events\Handlers\RestoreProductSerial::class,
        \Core\Events\Handlers\SetProductSerialCost::class,
        \Core\Events\Handlers\AddOrderShipmentToQueue::class,
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        parent::boot();
    }

    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
