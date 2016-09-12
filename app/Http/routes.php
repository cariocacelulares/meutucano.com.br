<?php

/**
 * Rota padrão para o Agnular
 */
Route::get('/', function() { return view('index'); });
Route::get('logs', '\Rap2hpoutre\LaravelLogViewer\LogViewerController@index');
Route::get('testApi', 'Integracao\MagentoController@queue');
Route::get('testeSky/{order}', 'Integracao\SkyhubController@teste');

/**
 * API
 */
Route::group(['prefix' => '/api'], function() {
    /**
     * Auth
     */
    Route::post('authenticate', 'Auth\AuthenticateController@authenticate');
    Route::get('authenticate/user', 'Auth\AuthenticateController@getAuthenticatedUser');
    Route::get('token', 'Auth\AuthenticateController@refreshToken');

    Route::group(['middleware' => 'jwt.auth'], function() {
        Route::controller('metas', 'Meta\MetaController');

        Route::post('upload', [
            'middleware' => ['role:admin|gestor|atendimento|faturamento'],
            'uses' => 'UploadController@upload'
        ]);
        Route::get('search',  'Partials\SearchController@search');
        Route::get('notas/xml/{id}',          'Pedido\NotaController@xml');
        Route::get('notas/danfe/{id}',        'Pedido\NotaController@danfe');
        Route::post('notas/email/{id}',       'Pedido\NotaController@email');

        Route::get('rastreios/etiqueta/{id}',  'Pedido\RastreioController@etiqueta');

        Route::get('minhas-senhas',            'Usuario\SenhaController@currentUserPasswords');

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
            Route::put('rastreios/refresh_all',         'Pedido\RastreioController@refreshAll');
            Route::put('rastreios/refresh_status/{id}', 'Pedido\RastreioController@refreshStatus');
            Route::put('rastreios/edit/{id}',           'Pedido\RastreioController@edit');
            Route::get('rastreios/important',           'Pedido\RastreioController@important');
            Route::get('rastreios/historico/{id}',      'Pedido\RastreioController@imagemHistorico');
            Route::resource('rastreios',                'Pedido\RastreioController', ['except' => ['create', 'edit']]);

            /**
             * PI's
             */
            Route::put('pis/edit/{id}', 'Pedido\Rastreio\PiController@edit');
            Route::get('pis/pending',   'Pedido\Rastreio\PiController@pending');
            Route::resource('pis',      'Pedido\Rastreio\PiController', ['except' => ['create', 'edit']]);

            /**
             * Devoluções
             */
            Route::put('devolucoes/edit/{id}', 'Pedido\Rastreio\DevolucaoController@edit');
            Route::get('devolucoes/pending',   'Pedido\Rastreio\DevolucaoController@pending');
            Route::resource('devolucoes',      'Pedido\Rastreio\DevolucaoController', ['except' => ['create', 'edit']]);

            /**
             * Logística reversa
             */
            Route::put('logisticas/edit/{id}', 'Pedido\Rastreio\LogisticaController@edit');
            Route::resource('logisticas',      'Pedido\Rastreio\LogisticaController', ['except' => ['create', 'edit']]);
        });

        /**
         * Faturamento
         */
        Route::group(['middleware' => ['role:admin|faturamento']], function() {

            /**
             * Listagem de notas por usuário
             */
            Route::get('notas/faturamento', 'Pedido\NotaController@notasFaturamento');
            Route::get('notas/faturar/{pedido_id}', 'Pedido\NotaController@faturar');

            /**
             * Código de rastreio
             */
            Route::get('codigos/gerar/{servico}', 'Codigo\FaturamentoCodigoController@generateCode');

            /**
             * Listagem de notas por usuário
             */
            Route::get('notas/faturamento', 'Pedido\NotaController@notasFaturamento');

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
            Route::get('senhas/usuario/{id}', 'Usuario\SenhaController@userPassword');
            Route::resource('senhas', 'Usuario\SenhaController', ['except' => ['create', 'edit']]);

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
        Route::resource('notas', 'Pedido\NotaController', ['except' => ['create', 'edit']]);

        /**
         * Comentarios
         */
        Route::get('comentarios/{pedido_id}', 'Pedido\ComentarioController@commentsFromOrder');
        Route::resource('comentarios', 'Pedido\ComentarioController', ['except' => ['create', 'edit']]);

        /**
         * Clientes
         */
        Route::get('clientes/detail/{cliente_id}', 'Cliente\ClienteController@detail');
        Route::get('clientes/list', 'Cliente\ClienteController@tableList');
        Route::resource('clientes', 'Cliente\ClienteController', ['except' => ['create', 'edit', 'store']]);

        /**
         * Endereço
         */
        Route::resource('enderecos', 'Cliente\EnderecoController', ['except' => ['create', 'edit']]);

        /**
         * Produtos
         */
        Route::get('produtos/generatesku/{old_sku?}', 'Produto\ProdutoController@gerenateSku');
        Route::get('produtos/list', 'Produto\ProdutoController@tableList');
        Route::resource('produtos', 'Produto\ProdutoController');

        /**
         * Marcas
         */
        Route::get('marcas/list', 'Produto\MarcaController@tableList');
        Route::resource('marcas', 'Produto\MarcaController');

        /**
         * Linhas
         */
        Route::get('linhas/list', 'Produto\LinhaController@tableList');
        Route::resource('linhas', 'Produto\LinhaController');

        /**
         * Atributos
         */
        Route::get('atributos/linha/{linha_id}', 'Produto\Linha\AtributoController@fromLinha');
    });
});