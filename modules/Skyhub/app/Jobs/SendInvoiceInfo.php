<?php namespace Skyhub\Jobs;

use Core\Models\Pedido\Pedido;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Skyhub\Http\Controllers\SkyhubController;

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
        \Log::debug('Job Skyhub\SendInvoiceInfo criado', [$order]);
        $this->order = $order;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        \Log::debug('Job Skyhub\SendInvoiceInfo executado', [$this->order]);
        with(new SkyhubController())->orderInvoice($this->order);
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
        \Log::critical(logMessage($exception, 'Erro ao executar Job Skyhub\SendInvoiceInfo'), [$this->order]);
    }
}