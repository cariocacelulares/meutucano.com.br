<?php

Route::group(['middleware' => ['jwt.auth'], 'prefix' => 'api', 'namespace' => 'Marketing\Http\Controllers'], function () {
    /**
     * Template ML
     */
    Route::get('templateml/gerar', 'TemplatemlController@generateTemplate');
});
