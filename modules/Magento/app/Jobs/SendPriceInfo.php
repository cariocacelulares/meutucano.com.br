<?php namespace Magento\Jobs;

use Core\Models\Produto\Produto;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Magento\Http\Controllers\MagentoController;

class SendPriceInfo implements ShouldQueue
{
    use InteractsWithQueue, Queueable, SerializesModels;

    protected $product;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Produto $product)
    {
        \Log::debug('Job SendPriceInfo criado', [$product]);
        $this->product = $product;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        \Log::debug('Job SendPriceInfo executado', [$this->product]);
        $action = with(new MagentoController())->updatePrice($this->product);

        if ($action !== true) {
            if (get_class($action) == 'Exception') {
                throw new Exception($action->getMessage(), $action->getCode(), $action);
            } else {
                throw new Exception('Erro ao executar Job Magento\SendPriceInfo', 1);
            }
        }
    }

    /**
     * The job failed to process.
     *
     * @param  Exception  $exception
     * @return void
     */
    public function failed(Exception $exception)
    {
        \Log::critical(logMessage($exception, 'Erro ao executar Job SendPriceInfo'), [$this->product]);
    }
}
