<?php namespace Skyhub\Jobs;

use Core\Models\Pedido;
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

        $action = with(new SkyhubController())->orderInvoice($this->order);
        if ($action !== true) {
            if (get_class($action) == 'Exception') {
                // throw new Exception($action->getMessage(), $action->getCode(), $action);
            } else {
                // throw new Exception('Erro ao executar Job Skyhub\SendInvoiceInfo', 1);
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
        # TODO: enviar notificacao
        \Log::critical(logMessage($exception, '(failed) Erro ao executar Job Skyhub\SendInvoiceInfo'), [$this->order]);
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
        \Log::critical(logMessage($exception, '(fail) Erro ao executar Job Skyhub\SendInvoiceInfo'), [$this->order]);
    }
}
