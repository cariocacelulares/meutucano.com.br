<?php namespace Modules\Gamification\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Console\Scheduling\Schedule;
use Modules\Gamification\Console\Commands\LerFila;
use Modules\Gamification\Console\Commands\AdicionarTarefa;
use Modules\Gamification\Console\Commands\AdicionarVoto;
use Modules\Gamification\Console\Commands\NovoMes;

class ScheduleServiceProvider extends ServiceProvider
{
    /**
     * Commands that will be registered
     *
     * @var array
     */
    protected $commands = [
        LerFila::class,
        AdicionarTarefa::class,
        AdicionarVoto::class,
        NovoMes::class,
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

            $schedule->command('gamification:fila')
                ->everyMinute();

            $schedule->command('gamification:mes')
                ->monthlyOn(1, '05:00');
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