<?php

Route::group(['middleware' => ['jwt.auth'], 'prefix' => 'api/metas', 'namespace' => 'Meta\Http\Controllers'], function () {
    Route::get('atual', 'MetaController@atual');
});
