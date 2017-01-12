<?php

if (!function_exists('t')) {
    /**
     * Tucano configuration facade helper
     *
     * @param  string $key
     * @param  string $value
     * @return string
     */
    function t($key, $value = null)
    {
        if (isset($value)) {
            return \T::set($key, $value);
        }

        return \T::get($key);
    }
}
