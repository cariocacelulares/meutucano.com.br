<?php

Route::group(['middleware' => ['sentry', 'jwt.auth'], 'prefix' => 'api/inspecao_tecnica', 'namespace' => 'InspecaoTecnica\Http\Controllers'], function()
{
    Route::post('verificar-reserva', 'InspecaoTecnicaController@verificarReserva');
    Route::post('reserva', 'InspecaoTecnicaController@reservar');
    Route::post('priority/{id}', 'InspecaoTecnicaController@changePriority');

    Route::get('solicitadas', 'InspecaoTecnicaController@solicitadas');
    Route::get('fila', 'InspecaoTecnicaController@fila');
    Route::get('list', 'InspecaoTecnicaController@tableList');

    Route::resource('', 'InspecaoTecnicaController');
});
