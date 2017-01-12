<?php namespace Core\Transformers\Parsers;

use Carbon\Carbon;

/**
 * Class CommentParser
 * @package Core\Transformers\Parsers
 */
class CommentParser
{
    /**
     * Transform date to diference to now in textdomain
     * 
     * @param  timestamp $created_at
     * @return string
     */
    public static function getCreatedAtDiff($created_at)
    {
        Carbon::setLocale(config('app.locale'));

        return Carbon::createFromFormat('Y-m-d H:i:s', $created_at)->diffForHumans();
    }
}
