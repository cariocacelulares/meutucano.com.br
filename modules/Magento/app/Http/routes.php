<?php

Route::group(['middleware' => 'web', 'prefix' => 'magento', 'namespace' => 'Magento\Http\Controllers'], function()
{
    Route::get('/', 'MagentoController@index');
});
