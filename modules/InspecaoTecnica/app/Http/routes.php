<?php

Route::group(['middleware' => ['sentry', 'jwt.auth'], 'prefix' => 'api', 'namespace' => 'InspecaoTecnica\Http\Controllers'], function () {
    Route::group(['prefix' => 'inspecao_tecnica'], function () {
        Route::post('verificar-reserva', 'InspecaoTecnicaController@verificarReserva');
        Route::post('reserva', 'InspecaoTecnicaController@reservar');
        Route::post('priority/{id}', 'InspecaoTecnicaController@changePriority');
        Route::post('solicitar', 'InspecaoTecnicaController@solicitar');

        Route::get('solicitadas', 'InspecaoTecnicaController@solicitadas');
        Route::get('fila', 'InspecaoTecnicaController@fila');
        Route::get('list', 'InspecaoTecnicaController@tableList');
        Route::get('get/{id}', 'InspecaoTecnicaController@showByPedidoProduto');
    });

    Route::resource('inspecao_tecnica', 'InspecaoTecnicaController');
});
