<?php namespace Core\Providers;

use Illuminate\Support\ServiceProvider;
use Core\Models\Pedido;
use Core\Models\Pedido\PedidoProduto;
use Core\Models\Produto;
use Core\Models\Produto\ProductStock;
use Core\Models\Produto\ProductImei;
use Core\Models\Produto\Defect;
use Core\Models\Stock\Issue;
use Core\Models\Stock\Entry;
use Core\Observers\PedidoObserver;
use Core\Observers\PedidoProdutoObserver;
use Core\Observers\ProdutoObserver;
use Core\Observers\ProductStockObserver;
use Core\Observers\ProductImeiObserver;
use Core\Observers\DefectObserver;
use Core\Observers\EntryObserver;
use Core\Observers\StockIssueObserver;

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
        ProductStock::observe(ProductStockObserver::class);
        ProductImei::observe(ProductImeiObserver::class);
        Defect::observe(DefectObserver::class);
        Entry::observe(EntryObserver::class);
        Issue::observe(StockIssueObserver::class);
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
        \App::register(TitleVariationServiceProvider::class);
        \App::register(InvoiceServiceProvider::class);
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
