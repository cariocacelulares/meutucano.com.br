<?php

Route::group([
  'middleware' => ['sentry'/*, 'jwt.auth'*/],
  'prefix'     => 'allnation',
  'namespace'  => 'Allnation\Http\Controllers'
], function() {
    Route::get('/', 'AllnationProductController@fetchProducts');
});
