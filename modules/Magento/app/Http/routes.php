<?php

Route::group(['middleware' => 'web', 'prefix' => 'api/magento', 'namespace' => 'Magento\Http\Controllers'], function()
{
    Route::get('/categories', 'MagentoController@fetchCategories');
});
