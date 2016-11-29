<?php

Route::group(['middleware' => 'web', 'prefix' => 'skyhub', 'namespace' => 'Modules\Skyhub\Http\Controllers'], function()
{
    Route::get('/', 'SkyhubController@index');
});
