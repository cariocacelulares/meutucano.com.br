<?php namespace Mercadolivre\Jobs;

use Core\Models\Produto;
use Illuminate\Bus\Queueable;
use Core\Models\Produto\ProductStock;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Mercadolivre\Http\Controllers\AdController;

class SendStockInfo implements ShouldQueue
{
    use Queueable,
        SerializesModels,
        InteractsWithQueue;

    /**
     * @var Stock
     */
     protected $productStock;

     /**
      * @var Product
      */
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
        \Log::debug('Job Mercadolivre:SendStockInfo executado', [$this->product]);
        with(new AdController())->updateStockByProduct($this->product);
    }

    /**
     * The job failed to process.
     *
     * @param  Exception  $exception
     * @return void
     */
    public function failed(\Exception $exception)
    {
        \Log::critical(logMessage($exception, 'Erro ao executar Job Mercadolivre:SendStockInfo'), [$this->product]);
    }
}
