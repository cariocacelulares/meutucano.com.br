<?php namespace Allnation\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Console\Scheduling\Schedule;
use Allnation\Console\Commands\AllnationStockAndPrice;
use Allnation\Console\Commands\AllnationProducts;

class ScheduleServiceProvider extends ServiceProvider
{
    /**
     * Commands that will be registered
     *
     * @var array
     */
    protected $commands = [
        AllnationStockAndPrice::class,
        AllnationProducts::class,
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

            //$schedule->command('allnation:stocks-prices')
                //->everyTenMinutes();

            $schedule->command('allnation:products')
                ->twiceDaily(2, 13);
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
