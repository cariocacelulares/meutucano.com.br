<?php namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        Commands\RefreshRastreios::class,
        Commands\RefreshMagentoStock::class,
        Commands\SkyhubPedido::class,
        Commands\SkyhubPedidos::class,
        Commands\MagentoPedido::class,
        Commands\MagentoPedidos::class,
        Commands\MagentoProdutos::class,
        Commands\CancelOldOrders::class,
        Commands\Gamification\LerFila::class,
        Commands\Gamification\AdicionarTarefa::class,
        Commands\Gamification\AdicionarVoto::class,
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        $schedule->command('refresh:rastreios')
            ->twiceDaily(1, 12);

        $schedule->command('skyhub:pedidos')
            ->everyMinute();

        $schedule->command('magento:pedidos')
            ->everyMinute();

        $schedule->command('refresh:stock')
            ->everyMinute();

        $schedule->command('pedidos:cancelold')
            ->daily();

        /**
         * Gamification
         */
        $schedule->command('gamification:fila')
            ->everyMinute();
    }
}