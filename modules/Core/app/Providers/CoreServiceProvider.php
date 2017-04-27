<?php namespace Core\Providers;

use Illuminate\Support\ServiceProvider;
use Core\Models\Order;
use Core\Models\OrderProduct;
use Core\Models\Product;
use Core\Models\DepotProduct;
use Core\Models\ProductImei;
use Core\Models\ProductDefect;
use Core\Models\ProductImeiIssue;
use Core\Models\DepotEntry;
use Core\Observers\OrderObserver;
use Core\Observers\OrderProductObserver;
use Core\Observers\ProductObserver;
use Core\Observers\ProductDepotObserver;
use Core\Observers\ProductImeiObserver;
use Core\Observers\DefectObserver;
use Core\Observers\EntryObserver;
use Core\Observers\DepotIssueObserver;

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

        Product::observe(ProductObserver::class);
        Order::observe(OrderObserver::class);
        OrderProduct::observe(OrderProductObserver::class);
        DepotProduct::observe(ProductDepotObserver::class);
        ProductImei::observe(ProductImeiObserver::class);
        ProductDefect::observe(DefectObserver::class);
        DepotEntry::observe(EntryObserver::class);
        ProductImeiIssue::observe(DepotIssueObserver::class);
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
        \App::register(DepotServiceProvider::class);
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
