<?php namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Validator;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Validator::extend('same_size_from', function($attribute, $value, $parameters, $validator) {
            $data      = $validator->getData();
            $path      = substr($attribute, 0, strrpos($attribute, '.')) . '.' . $parameters[0];
            $fromValue = array_get($data, $path, 0);

            return sizeof($value) == $fromValue;
        });

        Validator::replacer('same_size_from', function($message, $attribute, $rule, $parameters) {
            return str_replace(':field', $parameters[0], $message);
        });
    }
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
