<?php namespace Mercadolivre\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;
use Mercadolivre\Events\Handlers\AddStockToQueue;

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
        AddStockToQueue::class,
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
