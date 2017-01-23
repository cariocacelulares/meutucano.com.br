<?php namespace Magento\Jobs;

use Core\Models\Produto;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Magento\Http\Controllers\MagentoController;

class SendStockInfo implements ShouldQueue
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
        \Log::debug('Job SendStockInfo criado', [$product]);
        $this->product = $product;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        \Log::debug('Job SendStockInfo executado', [$this->product]);
        with(new MagentoController())->updateStock($this->product);
    }

    /**
     * The job failed to process.
     *
     * @param  Exception  $exception
     * @return void
     */
    public function failed(Exception $exception)
    {
        # TODO: enviar notificacao
        \Log::critical(logMessage($exception, 'Erro ao executar Job SendStockInfo'), [$this->product]);
    }
}
