<?php

Route::group(['middleware' => 'web', 'prefix' => 'magento', 'namespace' => 'Modules\Magento\Http\Controllers'], function()
{
    Route::get('/', 'MagentoController@index');
});
