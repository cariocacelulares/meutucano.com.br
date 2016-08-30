<?php

/**
 * Rota padrão para o Agnular
 */
Route::get('/', function () { return view('index'); });
Route::get('logs', '\Rap2hpoutre\LaravelLogViewer\LogViewerController@index');

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
        Route::post('notas/email/{id}',       'Pedido\PedidoNotaController@email');

        Route::get('rastreios/etiqueta/{id}', 'Rastreio\RastreioController@etiqueta');
        Route::get('minhas-senhas',           'Senha\UsuarioSenhaController@currentUserPasswords');

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
            Route::put('rastreios/refresh_all',         'Rastreio\RastreioController@refreshAll');
            Route::put('rastreios/refresh_status/{id}', 'Rastreio\RastreioController@refreshStatus');
            Route::put('rastreios/edit/{id}',           'Rastreio\RastreioController@edit');
            Route::get('rastreios/important',           'Rastreio\RastreioController@important');
            Route::resource('rastreios',                'Rastreio\RastreioController', ['except' => ['create', 'edit']]);

            /**
             * PI's
             */
            Route::put('pis/edit/{id}', 'Pi\PiController@edit');
            Route::get('pis/pending',   'Pi\PiController@pending');
            Route::resource('pis',      'Pi\PiController', ['except' => ['create', 'edit']]);

            /**
             * Devoluções
             */
            Route::put('devolucoes/edit/{id}', 'Devolucao\DevolucaoController@edit');
            Route::get('devolucoes/pending',   'Devolucao\DevolucaoController@pending');
            Route::resource('devolucoes',      'Devolucao\DevolucaoController', ['except' => ['create', 'edit']]);

            /**
             * Logística reversa
             */
            Route::put('logisticas/edit/{id}', 'Logistica\LogisticaController@edit');
            Route::resource('logisticas',      'Logistica\LogisticaController', ['except' => ['create', 'edit']]);
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
            Route::get('usuarios/list', 'Usuario\UsuarioController@tableList');
            Route::resource('usuarios', 'Usuario\UsuarioController', ['except' => ['create', 'edit']]);

            /**
             * Senhas
             */
            Route::get('senhas/usuario/{id}', 'Senha\UsuarioSenhaController@userPassword');
            Route::resource('senhas', 'Senha\UsuarioSenhaController', ['except' => ['create', 'edit']]);

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
        Route::get('pedidos/list', 'Pedido\PedidoController@tableList');
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
        Route::get('clientes/list', 'Cliente\ClienteController@tableList');
        Route::resource('clientes', 'Cliente\ClienteController', ['except' => ['create', 'edit', 'store', 'update']]);

        /**
         * Linhas
         */
        Route::get('linhas/list', 'Linha\LinhaController@tableList');
        Route::resource('linhas', 'Linha\LinhaController');

        /**
         * Marcas
         */
        Route::get('marcas/list', 'Marca\MarcaController@tableList');
        Route::resource('marcas', 'Marca\MarcaController');
    });
});
