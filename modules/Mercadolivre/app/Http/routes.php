<?php

Route::get('api/mercadolivre/auth', 'Mercadolivre\Http\Controllers\AuthController@init');
Route::get('api/mercadolivre/auth/callback', 'Mercadolivre\Http\Controllers\AuthController@callback');
Route::get('api/mercadolivre/stock', 'Mercadolivre\Http\Controllers\AdController@testStock');

Route::group([
    'middleware' => ['jwt.auth'],
    'prefix' => 'api/mercadolivre',
    'namespace' => 'Mercadolivre\Http\Controllers'
], function () {
    Route::get('ads/grouped', 'AdController@groupedList');
    Route::get('ads/grouped', 'AdController@groupedList');
    Route::put('ads/{code}/pause', 'AdController@pauseAd');
    Route::put('ads/{code}/activate', 'AdController@activateAd');
    Route::resource('ads', 'AdController');

    Route::get('templates/list', 'TemplateController@tableList');
    Route::resource('templates', 'TemplateController');

    Route::get('categories/sub/{id}', 'CategoryController@fetchSubCategories');
    Route::get('categories/predict', 'CategoryController@predictCategory');
    Route::get('categories/{id}', 'CategoryController@fetchCategoriesFromPath');
});
