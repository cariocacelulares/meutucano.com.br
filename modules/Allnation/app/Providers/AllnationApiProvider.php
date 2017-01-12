<?php namespace Allnation\Providers;

use Illuminate\Support\ServiceProvider;
use Allnation\Http\Services\AllnationApi;

class AllnationApiProvider extends ServiceProvider
{
    /**
     * @var bool
     */
    protected $defer = true;

    /**
     * @return void
     */
    public function register()
    {
        $this->app->bind(AllnationApi::class, function () {
            return new AllnationApi();
        });
    }

    /**
     * @return array
     */
    public function provides()
    {
        return [AllnationApi::class];
    }
}
