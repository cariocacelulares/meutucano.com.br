<?php namespace Magento\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;
use Magento\Events\Handlers\AddOrderToQueue;
use Magento\Events\Handlers\AddStockToQueue;
use Magento\Events\Handlers\AddPriceToQueue;

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
        AddOrderToQueue::class,
        AddStockToQueue::class,
        AddPriceToQueue::class,
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
