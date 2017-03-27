<?php namespace Magento\Jobs;

use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Core\Models\Produto;
use Core\Models\Produto\ProductStock;
use Magento\Http\Controllers\MagentoController;

class SendStockInfo implements ShouldQueue
{
    use InteractsWithQueue, Queueable, SerializesModels;

    protected $productStock;
    protected $product;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(ProductStock $productStock)
    {
        \Log::debug('Job SendStockInfo criado', [$productStock]);
        $this->productStock = $productStock;
        $this->product = Produto::find($productStock->product_sku);
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        \Log::debug('Job SendStockInfo executado', [$this->productStock, $this->product]);
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
        \Log::critical(logMessage($exception, 'Erro ao executar Job SendStockInfo'), [$this->productStock, $this->product]);
    }
}
