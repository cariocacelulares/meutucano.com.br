<?php namespace Core\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Console\Scheduling\Schedule;
use Core\Console\Commands\CancelOldOrders;
use Core\Console\Commands\InvoiceOrders;

class ScheduleServiceProvider extends ServiceProvider
{
    /**
     * Commands that will be registered
     *
     * @var array
     */
    protected $commands = [
        CancelOldOrders::class,
        InvoiceOrders::class,
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
