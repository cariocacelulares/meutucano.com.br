<?php

Route::group(['middleware' => ['sentry', 'jwt.auth'], 'prefix' => 'api/sugestoes', 'namespace' => 'Modules\Sugestao\Http\Controllers'], function()
{
    Route::get('list', 'SugestaoController@tableList');
    Route::resource('', 'SugestaoController');
});
