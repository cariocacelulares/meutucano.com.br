<?php namespace Core\Providers;

use Core\Facades\StockProvider;
use Illuminate\Support\ServiceProvider;

class StockServiceProvider extends ServiceProvider
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
        $this->app->bind('stockProvider', function () {
            return new StockProvider;
        });
    }
}
