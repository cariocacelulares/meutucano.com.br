<?php namespace Correios\Providers;

use Illuminate\Support\ServiceProvider;
use Rastreio\Providers\EventServiceProvider;

class CorreiosServiceProvider extends ServiceProvider
{
    /**
     * Indicates if loading of the provider is deferred.
     *
     * @var bool
     */
    protected $defer = false;

    /**
     * Boot the application events.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerTranslations();
        $this->registerConfig();
    }

    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register()
    {
    }

    /**
     * Register config.
     *
     * @return void
     */
    protected function registerConfig()
    {
        $this->publishes([
            __DIR__.'/../../config/config.php' => config_path('correios.php'),
        ]);
        $this->mergeConfigFrom(
            __DIR__.'/../../config/config.php', 'correios'
        );
    }

    /**
     * Register translations.
     *
     * @return void
     */
    public function registerTranslations()
    {
        $langPath = base_path('resources/lang/modules/correios');

        if (is_dir($langPath)) {
            $this->loadTranslationsFrom($langPath, 'correios');
        } else {
            $this->loadTranslationsFrom(__DIR__ .'/../', 'correios');
        }
    }

    /**
     * Get the services provided by the provider.
     *
     * @return array
     */
    public function provides()
    {
        return [];
    }
}
