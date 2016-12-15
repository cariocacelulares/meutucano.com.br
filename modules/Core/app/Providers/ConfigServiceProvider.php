<?php namespace Core\Providers;

use Core\Facades\ConfigProvider;
use Illuminate\Support\ServiceProvider;

class ConfigServiceProvider extends ServiceProvider
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
        $this->app->bind('configProvider', function () {
            return new ConfigProvider;
        });
    }
}
