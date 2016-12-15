<?php namespace Gamification\Providers;

use Illuminate\Support\ServiceProvider;
use Gamification\Providers\EventServiceProvider;
use Gamification\Providers\ScheduleServiceProvider;

class GamificationServiceProvider extends ServiceProvider
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
        \App::register(ScheduleServiceProvider::class);
    }

    /**
     * Register config.
     *
     * @return void
     */
    protected function registerConfig()
    {
        $this->publishes([
            __DIR__.'/../../config/config.php' => config_path('gamification.php'),
        ]);
        $this->mergeConfigFrom(
            __DIR__.'/../../config/config.php', 'gamification'
        );
    }

    /**
     * Register views.
     *
     * @return void
     */
    public function registerViews()
    {
        $viewPath = base_path('resources/views/modules/gamification');

        $sourcePath = __DIR__.'/../';

        $this->publishes([
            $sourcePath => $viewPath
        ]);

        $this->loadViewsFrom(array_merge(array_map(function ($path) {
            return $path . '/modules/gamification';
        }, \Config::get('view.paths')), [$sourcePath]), 'gamification');
    }

    /**
     * Register translations.
     *
     * @return void
     */
    public function registerTranslations()
    {
        $langPath = base_path('resources/lang/modules/gamification');

        if (is_dir($langPath)) {
            $this->loadTranslationsFrom($langPath, 'gamification');
        } else {
            $this->loadTranslationsFrom(__DIR__ .'/../', 'gamification');
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
