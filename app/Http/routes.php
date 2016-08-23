<?php

/**
 * Rota padrão para o Agnular
 */
Route::get('/', function () { return view('index'); });

/**
 * API
 */
Route::group(['prefix' => '/api'], function() {
    
    /**
     * Auth
     */
    Route::post('authenticate', 'AuthenticateController@authenticate');
    Route::get('authenticate/user', 'AuthenticateController@getAuthenticatedUser');
    Route::get('token', 'AuthenticateController@refreshToken');

    Route::group(['middleware' => 'jwt.auth'], function() {
        Route::controller('metas', 'Meta\MetaController');

        Route::post('upload', [
            'middleware' => ['role:admin|gestor|atendimento|faturamento'],
            'uses' => 'UploadController@upload'
        ]);
        Route::get('search',  'SearchController@search');
        Route::get('notas/xml/{id}',          'Pedido\PedidoNotaController@xml');
        Route::get('notas/danfe/{id}',        'Pedido\PedidoNotaController@danfe');
        Route::post('notas/email/{id}',        'Pedido\PedidoNotaController@email');
        
        Route::get('rastreios/etiqueta/{id}', 'Pedido\PedidoRastreioController@etiqueta');
        Route::get('minhas-senhas',           'Interno\UsuarioSenhaController@currentUserPasswords');

        /**
         * Template ML
         */
        Route::get('templateml/gerar', 'Marketing\TemplatemlController@generateTemplate');

        /**
         * Atendimento
         */
        Route::group(['middleware' => ['role:admin|atendimento']], function() {

            /**
             * Rastreios
             */
            Route::put('rastreios/refresh_all',         'Pedido\PedidoRastreioController@refreshAll');
            Route::put('rastreios/refresh_status/{id}', 'Pedido\PedidoRastreioController@refreshStatus');
            Route::put('rastreios/edit/{id}',           'Pedido\PedidoRastreioController@edit');
            Route::resource('rastreios', 'Pedido\PedidoRastreioController', ['except' => ['create', 'edit']]);

            /**
             * PI's
             */
            Route::put('pis/edit/{id}', 'Pedido\PedidoRastreioPiController@edit');
            Route::resource('pis', 'Pedido\PedidoRastreioPiController', ['except' => ['create', 'edit']]);

            /**
             * Devoluções
             */
            Route::put('devolucoes/edit/{id}', 'Pedido\PedidoRastreioDevolucaoController@edit');
            Route::resource('devolucoes', 'Pedido\PedidoRastreioDevolucaoController', ['except' => ['create', 'edit']]);

            /**
             * Logística reversa
             */
            Route::put('logisticas/edit/{id}', 'Pedido\PedidoRastreioLogisticaController@edit');
            Route::resource('logisticas', 'Pedido\PedidoRastreioLogisticaController', ['except' => ['create', 'edit']]);
        });

        /**
         * Faturamento
         */
        Route::group(['middleware' => ['role:admin|faturamento']], function() {

            /**
             * Listagem de notas por usuário
             */
            Route::get('notas/faturamento', 'Pedido\PedidoNotaController@notasFaturamento');
            Route::get('notas/faturar/{pedido_id}', 'Pedido\PedidoNotaController@faturar');

            /**
             * Código de rastreio
             */
            Route::get('codigos/gerar/{servico}', 'Codigo\FaturamentoCodigoController@generateCode');

            /**
             * Listagem de notas por usuário
             */
            Route::get('notas/faturamento', 'Pedido\PedidoNotaController@notasFaturamento');

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
             * Usuários
             */
            Route::resource('usuarios', 'Interno\UsuarioController', ['except' => ['create', 'edit']]);
            Route::resource('senhas', 'Interno\UsuarioSenhaController', ['except' => ['create', 'edit']]);
            Route::get('senhas/usuario/{id}', 'Interno\UsuarioSenhaController@userPassword');

            /**
             * Admin
             */
            Route::get('relatorios/icms', 'Admin\RelatorioController@icms');
        });

        /**
         * Pedidos
         */
        Route::put('pedidos/status/{pedido_id}', 'Pedido\PedidoController@alterarStatus');
        Route::put('pedidos/prioridade/{pedido_id}', 'Pedido\PedidoController@prioridade');
        Route::resource('pedidos', 'Pedido\PedidoController', ['except' => ['create', 'edit']]);

        /**
         * Notas
         */
        Route::resource('notas', 'Pedido\PedidoNotaController', ['except' => ['create', 'edit']]);

        /**
         * Comentarios
         */
        Route::get('comentarios/{pedido_id}', 'Pedido\PedidoComentarioController@commentsFromOrder');
        Route::resource('comentarios', 'Pedido\PedidoComentarioController', ['except' => ['create', 'edit']]);

        /**
         * Clientes
         */
        Route::resource('clientes', 'Cliente\ClienteController', ['except' => ['create', 'edit', 'store', 'update']]);

        /**
         * Linhas
         */
        Route::resource('linhas', 'Linha\LinhaController');
    });
});
