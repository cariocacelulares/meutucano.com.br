<?php namespace Modules\Gamification\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Console\Scheduling\Schedule;
use Modules\Gamification\Console\Commands\RefreshMagentoStock;
use Modules\Gamification\Console\Commands\MagentoPedido;
use Modules\Gamification\Console\Commands\MagentoPedidos;
use Modules\Gamification\Console\Commands\MagentoProdutos;

class ScheduleServiceProvider extends ServiceProvider
{
    /**
     * Commands that will be registered
     *
     * @var array
     */
    protected $commands = [
        RefreshMagentoStock::class,
        MagentoPedido::class,
        MagentoPedidos::class,
        MagentoProdutos::class,
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

            $schedule->command('magento:pedidos')
                ->everyMinute();

            $schedule->command('refresh:stock')
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