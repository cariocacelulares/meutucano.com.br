<?php namespace Core\Providers;

use Illuminate\Support\Facades\Event;
use Core\Events\Handlers\SetRefund;
use Core\Events\Handlers\UpdateStock;
use Core\Events\Handlers\SetProductCost;
use Core\Events\Handlers\DeleteProductSerial;
use Core\Events\Handlers\RestoreProductSerial;
use Core\Events\Handlers\ConvertEntrySerials;
use Core\Events\Handlers\SetProductSerialCost;
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
        SetRefund::class,
        UpdateStock::class,
        SetProductCost::class,
        DeleteProductSerial::class,
        ConvertEntrySerials::class,
        RestoreProductSerial::class,
        SetProductSerialCost::class,
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
