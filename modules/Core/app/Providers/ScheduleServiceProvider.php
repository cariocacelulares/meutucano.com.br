<?php namespace Core\Providers;

use Illuminate\Support\ServiceProvider;
use Core\Console\Commands\CancelOldOrders;
use Illuminate\Console\Scheduling\Schedule;
use Core\Console\Commands\RefreshOrderShipments;

class ScheduleServiceProvider extends ServiceProvider
{
    /**
     * Commands that will be registered
     *
     * @var array
     */
    protected $commands = [
        CancelOldOrders::class,
        RefreshOrderShipments::class,
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

            $schedule->command('orders:cancel-old')
                ->daily();

            $schedule->command('order-shipments:refresh')
                ->twiceDaily(1, 12);
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
