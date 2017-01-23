<?php namespace Skyhub\Jobs;

use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Core\Models\Pedido;
use Skyhub\Http\Controllers\SkyhubController;

class SendCancelInfo implements ShouldQueue
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
        \Log::debug('Job Skyhub\SendCancelInfo criado', [$order]);
        $this->order = $order;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        \Log::debug('Job Skyhub\SendCancelInfo executado', [$this->order]);
        with(new SkyhubController())->cancelOrder($this->order);
    }

    /**
     * The job failed to process.
     *
     * @param  Exception  $exception
     * @return void
     */
    public function failed(Exception $exception)
    {
        \Log::critical(logMessage($exception, 'Erro ao executar Job Skyhub\SendCancelInfo'), [$this->order]);
    }
}
