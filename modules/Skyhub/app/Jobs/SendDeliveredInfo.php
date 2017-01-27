<?php namespace Skyhub\Jobs;

use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Core\Models\Pedido\Pedido;
use Skyhub\Http\Controllers\SkyhubController;

class SendDeliveredInfo implements ShouldQueue
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
        \Log::debug('Job Skyhub\SendDeliveredInfo criado', [$order]);
        $this->order = $order;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        \Log::debug('Job Skyhub\SendDeliveredInfo executado', [$this->order]);
        $action = with(new SkyhubController())->orderDelivered($this->order);

        if ($action !== true) {
            if (get_class($action) == 'Exception') {
                throw new Exception($action->getMessage(), $action->getCode(), $action);
            } else {
                throw new Exception('Erro ao executar Job Skyhub\SendDeliveredInfo', 1);
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
        \Log::critical(logMessage($exception, '(failed) Erro ao executar Job Skyhub\SendDeliveredInfo'), [$this->order]);
    }
}
