<?php namespace App\Listeners;

use App\Events\ProductStockChange;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Http\Controllers\Integracao\MagentoController;

class SendProductToQueue
{
    /**
     * Handle the event.
     *
     * @param  ProductStockChange  $event
     * @return void
     */
    public function handle(ProductStockChange $event)
    {
        \Log::debug('Listener SendProductToQueue ativado produto: ' . $event->produto_sku);
        with(new MagentoController(false))->sendProductToQueue($event->produto_sku);
    }
}