<?php

Route::group(['middleware' => ['jwt.auth'], 'prefix' => 'api', 'namespace' => 'Rastreio\Http\Controllers'], function () {
    /**
     * Rastreios
     */
    Route::group(['prefix' => 'rastreios'], function () {
        Route::get('etiqueta/{id}', 'RastreioController@etiqueta');

        Route::group(['middleware' => 'role:admin|atendimento'], function () {
            Route::get('important', 'RastreioController@important');
            Route::get('historico/{id}', 'RastreioController@imagemHistorico');
            Route::get('pi/{id}', 'RastreioController@pi');

            Route::put('historico/{id}', 'RastreioController@forceScreenshot');
        });
    });
    Route::resource('rastreios', 'RastreioController', ['except' => ['create', 'edit'], 'middleware' => 'role:admin|atendimento']);

    /**
     * Atendimento
     */
    Route::group(['middleware' => 'role:admin|atendimento'], function () {
        /**
         * PI's
         */
        Route::group(['prefix' => 'pis'], function () {

        });
        Route::resource('pis', 'PiController', ['except' => ['create', 'edit']]);

        /**
         * Devoluções
         */
        Route::group(['prefix' => 'devolucoes'], function () {

        });
        Route::resource('devolucoes', 'DevolucaoController', ['except' => ['create', 'edit']]);

        /**
         * Logística reversa
         */
         Route::group(['prefix' => 'logisticas'], function () {

         });
        Route::resource('logisticas', 'LogisticaController', ['except' => ['create', 'edit']]);

        /**
         * Rastreios monitorados
         */
        Route::group(['prefix' => 'rastreio/monitorados'], function () {
            Route::get('simple-list', 'MonitoradoController@simpleList');
            Route::get('list', 'MonitoradoController@tableList');

            Route::delete('parar/{rastreio_id}', 'MonitoradoController@stop');
        });
        Route::resource('rastreio/monitorados', 'MonitoradoController', ['except' => ['create', 'edit']]);
    });
});
