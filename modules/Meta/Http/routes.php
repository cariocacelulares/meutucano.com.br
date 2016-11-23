<?php

Route::group(['middleware' => ['sentry', 'jwt.auth'], 'prefix' => 'api/metas', 'namespace' => 'Modules\Meta\Http\Controllers'], function()
{
    Route::get('atual', 'MetaController@atual');
});
