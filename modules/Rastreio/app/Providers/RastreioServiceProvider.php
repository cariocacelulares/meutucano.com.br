<?php namespace Rastreio\Providers;

use Illuminate\Support\ServiceProvider;
use Rastreio\Models\Rastreio;
use Rastreio\Observers\RastreioObserver;
use Rastreio\Providers\EventServiceProvider;

class RastreioServiceProvider extends ServiceProvider
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
        $this->registerViews();
    }

    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register()
    {
        \App::register(ScheduleServiceProvider::class);
        \App::register(EventServiceProvider::class);
    }

    /**
     * Register config.
     *
     * @return void
     */
    protected function registerConfig()
    {
        $this->publishes([
            __DIR__.'/../../config/config.php' => config_path('rastreio.php'),
        ]);
        $this->mergeConfigFrom(
            __DIR__.'/../../config/config.php', 'rastreio'
        );
    }

    /**
     * Register views.
     *
     * @return void
     */
    public function registerViews()
    {
        $viewPath = base_path('resources/views/modules/rastreio');

        $sourcePath = __DIR__.'/../';

        $this->publishes([
            $sourcePath => $viewPath
        ]);

        $this->loadViewsFrom(array_merge(array_map(function ($path) {
            return $path . '/modules/rastreio';
        }, \Config::get('view.paths')), [$sourcePath]), 'rastreio');
    }

    /**
     * Register translations.
     *
     * @return void
     */
    public function registerTranslations()
    {
        $langPath = base_path('resources/lang/modules/rastreio');

        if (is_dir($langPath)) {
            $this->loadTranslationsFrom($langPath, 'rastreio');
        } else {
            $this->loadTranslationsFrom(__DIR__ .'/../', 'rastreio');
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
