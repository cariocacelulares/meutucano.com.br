<?php namespace Core\Providers;

use Core\Models\Pedido;
use Core\Models\Pedido\PedidoProduto;
use Core\Models\Produto;
use Core\Observers\PedidoObserver;
use Core\Observers\PedidoProdutoObserver;
use Core\Observers\ProdutoObserver;
use Illuminate\Support\ServiceProvider;

class CoreServiceProvider extends ServiceProvider
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

        Produto::observe(ProdutoObserver::class);
        Pedido::observe(PedidoObserver::class);
        PedidoProduto::observe(PedidoProdutoObserver::class);
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
        \App::register(ConfigServiceProvider::class);
        \App::register(StockServiceProvider::class);
    }

    /**
     * Register config.
     *
     * @return void
     */
    protected function registerConfig()
    {
        $this->publishes([
            __DIR__.'/../../config/config.php' => config_path('core.php'),
        ]);
        $this->mergeConfigFrom(
            __DIR__.'/../../config/config.php', 'core'
        );
    }

    /**
     * Register views.
     *
     * @return void
     */
    public function registerViews()
    {
        $viewPath = base_path('resources/views/modules/core');

        $sourcePath = __DIR__.'/../';

        $this->publishes([
            $sourcePath => $viewPath
        ]);

        $this->loadViewsFrom(array_merge(array_map(function ($path) {
            return $path . '/modules/core';
        }, \Config::get('view.paths')), [$sourcePath]), 'core');
    }

    /**
     * Register translations.
     *
     * @return void
     */
    public function registerTranslations()
    {
        $langPath = base_path('resources/lang/modules/core');

        if (is_dir($langPath)) {
            $this->loadTranslationsFrom($langPath, 'core');
        } else {
            $this->loadTranslationsFrom(__DIR__ .'/../', 'core');
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
