<?php

Route::group([
  'middleware' => ['sentry'/*, 'jwt.auth'*/],
  'prefix'     => 'api/allnation',
  'namespace'  => 'Allnation\Http\Controllers'
], function() {
    Route::get('products/list', 'AllnationProductController@tableList');
    Route::resource('products', 'AllnationProductController', [
        'except' => ['create', 'edit']
    ]);
});
