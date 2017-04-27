<?php namespace Core\Providers;

use Core\Facades\DepotProvider;
use Illuminate\Support\ServiceProvider;

class DepotServiceProvider extends ServiceProvider
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
        $this->app->bind('depotProvider', function () {
            return new DepotProvider;
        });
    }
}
