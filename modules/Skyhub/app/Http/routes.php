<?php

Route::group(['middleware' => 'web', 'prefix' => 'skyhub', 'namespace' => 'Skyhub\Http\Controllers'], function () {
    Route::get('/', 'SkyhubController@index');
});
