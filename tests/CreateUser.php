<?php namespace Tests;

use App\Models\User\User;

class CreateUser
{
    /**
    * @return App\Models\User\User
    */
    public static function create($data = [])
    {
        return factory(User::class)->create($data);
    }
}
