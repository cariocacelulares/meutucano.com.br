<?php namespace Rastreio\Jobs;

use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Rastreio\Http\Controllers\RastreioController;
use Rastreio\Models\Rastreio;
// use Illuminate\Queue\SerializesModels;
use App\Jobs\Traits\SerializesNullableModels;

class GetScreenshot implements ShouldQueue
{
    use InteractsWithQueue, Queueable, SerializesNullableModels;

    protected $rastreio;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($rastreio)
    {
        if ($rastreio) {
            \Log::debug('Job Rastreio\GetScreenshot criado', [$rastreio->toArray()]);
            $this->rastreio = $rastreio;
        }
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        try {
            if ($this->rastreio) {
                \Log::debug('Job Rastreio\GetScreenshot executado', [$this->rastreio->toArray()]);
                with(new RastreioController())->forceScreenshot($this->rastreio);
            }
        } catch (\Exception $exception) {
            \Log::error(logMessage($exception, 'Não foi possível fazer o screenshot do rastreio.'));
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
        \Log::critical(logMessage($exception, 'Erro ao executar Job Rastreio\GetScreenshot'), [$this->rastreio]);
    }
}
