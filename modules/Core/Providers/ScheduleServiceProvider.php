<?php namespace Modules\Core\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Console\Scheduling\Schedule;
use Modules\Core\Console\Commands\RefreshRastreios;
use Modules\Core\Console\Commands\CancelOldOrders;

class ScheduleServiceProvider extends ServiceProvider
{
    /**
     * Commands that will be registered
     *
     * @var array
     */
    protected $commands = [
        RefreshRastreios::class,
        CancelOldOrders::class,
    ];

    /**
     * Boot the application events.
     *
     * @return void
     */
    public function boot()
    {
        $this->commands($this->commands);

        $this->app->booted(function () {
            $schedule = $this->app->make(Schedule::class);

            $schedule->command('refresh:rastreios')
                ->twiceDaily(1, 12);

            $schedule->command('pedidos:cancelold')
                ->daily();
        });
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