<?php namespace App\Providers;

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
        'App\Events\OrderSeminovo' => [
            'App\Listeners\CheckInspecoes'
        ],

        /* Gamification */
        'Modules\Gamification\Events\TarefaRealizada' => [
            'Modules\Gamification\Listeners\FilaAdicionar'
        ],
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        parent::boot();
        //
    }
}