<?php

Route::group(['middleware' => ['sentry', 'jwt.auth'], 'prefix' => 'api/sugestoes', 'namespace' => 'Sugestao\Http\Controllers'], function()
{
    Route::get('list', 'SugestaoController@tableList');
    Route::resource('', 'SugestaoController');
});
