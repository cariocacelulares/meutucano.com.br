<?php namespace Core\Providers;

use Illuminate\Support\ServiceProvider;
use Core\Facades\InvoiceProvider;

class InvoiceServiceProvider extends ServiceProvider
{
    /**
     * @var bool
     */
    protected $defer = false;

    /**
     * @return void
     */
    public function register()
    {
        $this->app->bind('invoiceProvider', function () {
            return new InvoiceProvider;
        });
    }
}
