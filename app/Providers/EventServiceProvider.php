<?php

namespace App\Providers;

use Illuminate\Contracts\Events\Dispatcher as DispatcherContract;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        'App\Events\ProductStockChange' => [
            'App\Listeners\SendProductToQueue',
        ],
        'App\Events\OrderCancel' => [
            'App\Listeners\SumStock',
            'App\Listeners\SendCancelInfo'
        ],
        'App\Events\ProductDispach' => [
            'App\Listeners\SubtractStock'
        ],
        'App\Events\Gamification\TarefaRealizada' => [
            'App\Listeners\Gamification\FilaAdicionar'
        ],
    ];

    /**
     * Register any other events for your application.
     *
     * @param  \Illuminate\Contracts\Events\Dispatcher  $events
     * @return void
     */
    public function boot(DispatcherContract $events)
    {
        parent::boot($events);

        //
    }
}
