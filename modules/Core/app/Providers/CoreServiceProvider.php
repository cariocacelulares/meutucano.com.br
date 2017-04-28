<?php namespace Core\Providers;

use Core\Models\Order;
use Core\Models\Product;
use Core\Models\DepotEntry;
use Core\Models\OrderProduct;
use Core\Models\DepotProduct;
use Core\Models\ProductSerial;
use Core\Models\ProductDefect;
use Core\Models\ProductSerialIssue;
use Illuminate\Support\ServiceProvider;

use Core\Observers\OrderObserver;
use Core\Observers\ProductObserver;
use Core\Observers\DepotEntryObserver;
use Core\Observers\OrderProductObserver;
use Core\Observers\DepotProductObserver;
use Core\Observers\ProductSerialObserver;
use Core\Observers\ProductDefectObserver;
use Core\Observers\ProductSerialIssueObserver;

class CoreServiceProvider extends ServiceProvider
{
    /**
     * @var bool
     */
    protected $defer = false;

    /**
     * @return void
     */
    public function boot()
    {
        $this->registerTranslations();
        $this->registerConfig();
        $this->registerViews();

        Order::observe(OrderObserver::class);
        Product::observe(ProductObserver::class);
        ProductDefect::observe(DefectObserver::class);
        DepotEntry::observe(DepotEntryObserver::class);
        OrderProduct::observe(OrderProductObserver::class);
        DepotProduct::observe(DepotProductObserver::class);
        ProductSerial::observe(ProductSerialObserver::class);
        ProductSerialIssue::observe(ProductSerialIssueObserver::class);
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
