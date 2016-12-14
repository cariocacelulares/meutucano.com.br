<?php namespace Rastreio\Jobs;

use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Rastreio\Http\Controllers\RastreioController;
use Rastreio\Models\Rastreio;

class SetDeadline implements ShouldQueue
{
    use InteractsWithQueue, Queueable, SerializesModels;

    protected $rastreio;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Rastreio $rastreio)
    {
        \Log::debug('Job Rastreio\SetDeadline criado', [$rastreio]);
        $this->rastreio = $rastreio;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        \Log::debug('Job Rastreio\SetDeadline executado', [$this->rastreio]);
        with(new RastreioController())->setDeadline($this->rastreio);
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
        \Log::critical(logMessage($exception, 'Erro ao executar Job Rastreio\SetDeadline'), [$this->rastreio]);
    }
}
