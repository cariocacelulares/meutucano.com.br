<?php

Route::group(['middleware' => ['sentry', 'jwt.auth'], 'prefix' => 'api', 'namespace' => 'Marketing\Http\Controllers'], function()
{
    /**
     * Template ML
     */
    Route::get('templateml/gerar', 'TemplatemlController@generateTemplate');
});
