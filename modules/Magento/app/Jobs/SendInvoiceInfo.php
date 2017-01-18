<?php namespace Magento\Jobs;

use Core\Models\Pedido\Pedido;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Magento\Http\Controllers\MagentoController;

class SendInvoiceInfo implements ShouldQueue
{
    use InteractsWithQueue, Queueable, SerializesModels;

    protected $order;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Pedido $order)
    {
        \Log::debug('Job Magento\SendInvoiceInfo criado', [$order]);
        $this->order = $order;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        \Log::debug('Job Magento\SendInvoiceInfo executado', [$this->order]);
        $action = with(new MagentoController())->orderInvoice($this->order);

        if ($action !== true) {
            $this->fail(new Exception('Erro ao executar Job Magento\SendInvoiceInfo', 1));
            $this->failed(new Exception('Erro ao executar Job Magento\SendInvoiceInfo', 1));
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
        # TODO: enviar notificacao
        \Log::critical(logMessage($exception, '(failed) Erro ao executar Job Magento\SendInvoiceInfo'), [$this->order]);
    }

    /**
     * The job fail to process.
     *
     * @param  Exception  $exception
     * @return void
     */
    public function fail(Exception $exception)
    {
        # TODO: enviar notificacao
        \Log::critical(logMessage($exception, '(fail) Erro ao executar Job Magento\SendInvoiceInfo'), [$this->order]);
    }
}
