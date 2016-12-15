<?php

Route::group(['middleware' => ['sentry', 'jwt.auth'], 'prefix' => 'api', 'namespace' => 'Rastreio\Http\Controllers'], function() {
    /**
     * Rastreios
     */
    Route::group(['prefix' => 'rastreios'], function() {
        Route::get('etiqueta/{id}', 'RastreioController@etiqueta');

        Route::group(['middleware' => 'role:admin|atendimento'], function() {
            Route::get('important', 'RastreioController@important');
            Route::get('historico/{id}', 'RastreioController@imagemHistorico');
            Route::get('pi/{id}', 'RastreioController@pi');
            Route::get('inspecao-tecnica/{id}', 'RastreioController@getPedidoProdutoInspecao');
            Route::get('busca-seminovos/{id}', 'RastreioController@existsSeminovos');

            Route::put('refresh_all', 'RastreioController@refreshAll');
            Route::put('refresh_status/{id}', 'RastreioController@refreshStatus');
            Route::put('edit/{id}', 'RastreioController@edit');
            Route::put('historico/{id}', 'RastreioController@forceScreenshot');
        });
    });
    Route::resource('rastreios', 'RastreioController', ['except' => ['create', 'edit'], 'middleware' => 'role:admin|atendimento']);

    /**
     * Atendimento
     */
    Route::group(['middleware' => 'role:admin|atendimento'], function() {
        /**
         * PI's
         */
        Route::group(['prefix' => 'pis'], function() {
            Route::get('pending', 'PiController@pending');
            Route::put('edit/{id}', 'PiController@edit');
        });
        Route::resource('pis', 'PiController', ['except' => ['create', 'edit']]);

        /**
         * Devoluções
         */
        Route::group(['prefix' => 'devolucoes'], function() {
            Route::get('pending', 'DevolucaoController@pending');
            Route::put('edit/{id}', 'DevolucaoController@edit');
        });
        Route::resource('devolucoes', 'DevolucaoController', ['except' => ['create', 'edit']]);

        /**
         * Logística reversa
         */
        Route::put('logisticas/edit/{id}', 'LogisticaController@edit');
        Route::resource('logisticas', 'LogisticaController', ['except' => ['create', 'edit']]);

        /**
         * Rastreios monitorados
         */
        Route::group(['prefix' => 'rastreio/monitorados'], function() {
            Route::get('simple-list', 'MonitoradoController@simpleList');
            Route::get('list', 'MonitoradoController@tableList');

            Route::delete('parar/{rastreio_id}', 'MonitoradoController@stop');
        });
        Route::resource('rastreio/monitorados', 'MonitoradoController');
    });
});