<?php namespace Modules\Skyhub\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Console\Scheduling\Schedule;
use Modules\Skyhub\Console\Commands\SkyhubPedido;
use Modules\Skyhub\Console\Commands\SkyhubPedidos;

class ScheduleServiceProvider extends ServiceProvider
{
    /**
     * Commands that will be registered
     *
     * @var array
     */
    protected $commands = [
        SkyhubPedido::class,
        SkyhubPedidos::class,
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

            $schedule->command('skyhub:pedidos')
                ->everyMinute();
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