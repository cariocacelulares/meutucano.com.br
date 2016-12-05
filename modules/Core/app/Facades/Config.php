<?php namespace Core\Facades;

use Core\Models\Config as TConfig;
use Illuminate\Support\Facades\Facade;

/**
 * ConfigProvider
 * @package Core\Facades;
 */
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
        return TConfig::findOrNew($key)->update(['value' => $value]);
    }
}

/**
 * Facade register
 * @package Core\Facades;
 */
class Config extends Facade
{
    protected static function getFacadeAccessor() { return 'configProvider'; }
}