<?php namespace Magento\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Console\Scheduling\Schedule;
use Magento\Console\Commands\RefreshMagentoStock;
use Magento\Console\Commands\MagentoPedido;
use Magento\Console\Commands\MagentoPedidos;
use Magento\Console\Commands\MagentoProdutos;

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
