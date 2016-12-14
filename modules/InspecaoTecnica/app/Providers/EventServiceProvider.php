<?php namespace InspecaoTecnica\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;
use InspecaoTecnica\Events\Handlers\AttachInspecaoTecnica;
use InspecaoTecnica\Events\Handlers\DeleteInspecaoTecnica;
use InspecaoTecnica\Events\Handlers\DetachInspecaoTecnica;

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
       AttachInspecaoTecnica::class,
       DetachInspecaoTecnica::class,
       DeleteInspecaoTecnica::class,
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