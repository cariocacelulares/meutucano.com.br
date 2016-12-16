<?php namespace InspecaoTecnica\Providers;

use Illuminate\Support\ServiceProvider;

class InspecaoTecnicaServiceProvider extends ServiceProvider
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
            __DIR__.'/../../config/config.php' => config_path('inspecaotecnica.php'),
        ]);
        $this->mergeConfigFrom(
            __DIR__.'/../../config/config.php', 'inspecaotecnica'
        );
    }

    /**
     * Register views.
     *
     * @return void
     */
    public function registerViews()
    {
        $viewPath = base_path('resources/views/modules/inspecaotecnica');

        $sourcePath = __DIR__.'/../';

        $this->publishes([
            $sourcePath => $viewPath
        ]);

        $this->loadViewsFrom(array_merge(array_map(function ($path) {
            return $path . '/modules/inspecaotecnica';
        }, \Config::get('view.paths')), [$sourcePath]), 'inspecaotecnica');
    }

    /**
     * Register translations.
     *
     * @return void
     */
    public function registerTranslations()
    {
        $langPath = base_path('resources/lang/modules/inspecaotecnica');

        if (is_dir($langPath)) {
            $this->loadTranslationsFrom($langPath, 'inspecaotecnica');
        } else {
            $this->loadTranslationsFrom(__DIR__ .'/../', 'inspecaotecnica');
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
