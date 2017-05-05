<?php namespace Core\Facades;

use Illuminate\Support\Facades\Facade;
use Core\Models\Additional\Config as TConfig;

class ConfigProvider
{
    /**
     * Get configuration
     *
     * @param  string $key
     * @return string
     */
    public function get($key)
    {
        return TConfig::find($key)['value'];
    }

    /**
     * Set configuration
     *
     * @param string $key
     * @param string $value
     * @return boolean
     */
    public function set($key, $value)
    {
        return TConfig::updateOrCreate(['key' => $key], ['value' => $value]);
    }
}

class Config extends Facade
{
    protected static function getFacadeAccessor()
    {
        return 'configProvider';
    }
}
