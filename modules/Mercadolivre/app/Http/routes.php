<?php

Route::get('mercadolivre/auth/callback', 'Mercadolivre\Http\Controllers\AuthController@callback');
Route::post('mercadolivre/notification', 'Mercadolivre\Http\Controllers\NotificationController@notification');
Route::get('mercadolivre/notification', 'Mercadolivre\Http\Controllers\NotificationController@notification');
Route::get('mercadolivre/shipment', 'Mercadolivre\Http\Controllers\NotificationController@testShipment');

Route::group([
    'middleware' => ['jwt.auth'],
    'prefix'     => 'api/mercadolivre',
    'namespace'  => 'Mercadolivre\Http\Controllers'
], function () {
    Route::get('auth/url', 'AuthController@authUrl');

    Route::get('ads/grouped', 'AdController@groupedList');
    Route::get('ads/grouped', 'AdController@groupedList');
    Route::put('ads/{id}/pause', 'AdController@pauseAd');
    Route::put('ads/{id}/activate', 'AdController@activateAd');
    Route::post('ads/{id}/publish', 'AdController@publish');
    Route::resource('ads', 'AdController');

    Route::get('templates/list', 'TemplateController@tableList');
    Route::resource('templates', 'TemplateController');

    Route::get('categories/sub/{id}', 'CategoryController@fetchSubCategories');
    Route::get('categories/predict', 'CategoryController@predictCategory');
    Route::get('categories/{id}', 'CategoryController@fetchCategoriesFromPath');
});
