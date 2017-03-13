<?php namespace Core\Providers;

use Core\Facades\TitleVariationProvider;
use Illuminate\Support\ServiceProvider;

class TitleVariationServiceProvider extends ServiceProvider
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
        $this->app->bind('titleVariationProvider', function () {
            return new TitleVariationProvider;
        });
    }
}
