<?php

/**
 * Rota padrão para o Agnular
 */
Route::get('/', function() { return view('index'); });
Route::get('logs', '\Rap2hpoutre\LaravelLogViewer\LogViewerController@index');

/**
 * API
 */
Route::group(['prefix' => '/api', 'middleware' => 'sentry'], function() {
    /**
     * Auth
     */
    Route::post('authenticate', 'Auth\AuthenticateController@authenticate');
    Route::get('authenticate/user', 'Auth\AuthenticateController@getAuthenticatedUser');
    Route::get('token', 'Auth\AuthenticateController@refreshToken');

    Route::group(['middleware' => 'jwt.auth'], function() {
        /**
         * Usuario
         */
        Route::group(['namespace' => 'Usuario'], function() {
            Route::get('senhas/minhas', 'SenhaController@currentUserPassword');

            Route::post('check-password/{user_id}', 'UsuarioController@checkPassword');

            /**
             * Administração
             */
            Route::group(['middleware' => ['role:admin']], function() {
                /**
                 * Usuários
                 */
                Route::group(['prefix' => 'usuarios'], function() {
                    Route::get('list', 'UsuarioController@tableList');
                    Route::resource('', 'UsuarioController', ['except' => ['create', 'edit']]);
                });

                /**
                 * Senhas
                 */
                Route::group(['prefix' => 'senhas'], function() {
                    Route::get('{id}', 'SenhaController@userPassword');
                    Route::resource('', 'SenhaController', ['except' => ['create', 'edit']]);
                });
            });
        });

        Route::post('upload', [
            'middleware' => ['role:admin|gestor|atendimento|faturamento'],
            'uses' => 'Partials\UploadController@upload'
        ]);

        Route::get('search', 'Partials\SearchController@search');

        /**
         * Faturamento
         */
        Route::group(['middleware' => ['role:admin|faturamento']], function() {
            /**
             * Código de rastreio
             */
            Route::get('codigos/gerar/{servico}', 'Codigo\FaturamentoCodigoController@generateCode');
        });

        /**
         * Administração
         */
        Route::group(['middleware' => ['role:admin']], function() {
            /**
             * Admin
             */
            Route::get('relatorios/icms', 'Admin\RelatorioController@icms');
        });

        /**
         * Relatórios
         */
        // Pedidos genérico
        Route::post('relatorios/pedido', 'Relatorio\PedidoController@run');
        Route::get('relatorios/pedido/{return_type}', 'Relatorio\PedidoController@run');

        // Produtos genérico
        Route::post('relatorios/produto', 'Relatorio\ProdutoController@run');
        Route::get('relatorios/produto/{return_type}', 'Relatorio\ProdutoController@run');
    });
});