<?php

Route::group(['middleware' => ['sentry', 'jwt.auth'], 'prefix' => 'api', 'namespace' => 'Modules\Marketing\Http\Controllers'], function()
{
    /**
     * Template ML
     */
    Route::get('templateml/gerar', 'TemplatemlController@generateTemplate');
});
