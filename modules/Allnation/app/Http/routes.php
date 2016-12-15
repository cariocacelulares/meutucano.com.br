<?php

Route::group([
  'middleware' => ['sentry'/*, 'jwt.auth'*/],
  'prefix'     => 'api/allnation',
  'namespace'  => 'Allnation\Http\Controllers'
], function () {
    Route::get('products/import', 'AllnationProductController@fetchProducts');
    Route::get('products/list', 'AllnationProductController@tableList');
    Route::post('products/create_product', 'AllnationProductController@createProduct');
    Route::resource('products', 'AllnationProductController', [
        'except' => ['create', 'edit']
    ]);
});
