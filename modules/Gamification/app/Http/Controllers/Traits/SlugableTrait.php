<?php namespace Gamification\Http\Controllers\Traits;

/**
 * Trait SlugableTrait
 * @package Gamification\Http\Controllers\Traits
 */
trait SlugableTrait
{
    private function generateSlug($field, $value, $count = false)
    {
        $m = self::MODEL;
        $value = str_slug($value);
        $search = ($value . ((!$count) ? '' : '-' . $count));

        if ($m::where($field, '=', $search)->first()) {
            $count = (!$count) ? 1 : $count + 1;
            return $this->generateSlug($field, $value, $count);
        } else {
            return $search;
        }
    }
}