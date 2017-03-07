<?php

Route::group([
    'middleware' => ['jwt.auth'],
    'prefix' => 'api/mercadolivre/',
    'namespace' => 'Mercadolivre\Http\Controllers'
], function () {
});
