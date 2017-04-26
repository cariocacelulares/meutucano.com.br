<?php namespace App\Models\User;

use Carbon\Carbon;
use Venturecraft\Revisionable\RevisionableTrait;

class UserPassword extends \Eloquent
{
    use RevisionableTrait;

    /**
     * @var boolean
     */
    protected $revisionCreationsEnabled = true;

    /**
     * @var array
     */
    protected $fillable = [
        'user_id',
        'description',
        'url',
        'username',
        'password',
    ];
}
