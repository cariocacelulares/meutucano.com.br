<?php namespace Core\Console\Commands;

use Illuminate\Console\Command;
use Core\Http\Controllers\Order\OrderController;

class CancelOldOrders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'orders:cancel-old';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cancel old orders due to deadline configured by store';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $return = with(new OrderController())->cancelOldOrders();
        $this->comment($return);
    }
}
