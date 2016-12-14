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

        /**
         * Pedidos
         */
        Route::get('pedidos/cidades/{uf}', 'Pedido\PedidoController@cidades');
        Route::get('pedidos/total-orders-status', 'Pedido\PedidoController@totalOrdersByStatus');
        Route::get('pedidos/total-orders-date', 'Pedido\PedidoController@totalOrdersByDate');
        Route::get('pedidos/total-orders/{mes?}/{ano?}', 'Pedido\PedidoController@totalOrders');
        Route::get('pedidos/cancelamento/{id}', 'Pedido\PedidoController@imagemCancelamento');

        Route::post('pedidos/status/{pedido_id}', 'Pedido\PedidoController@alterarStatus');
        Route::put('pedidos/prioridade/{pedido_id}', 'Pedido\PedidoController@prioridade');
        Route::put('pedidos/segurar/{pedido_id}', 'Pedido\PedidoController@segurar');
        Route::get('pedidos/list', 'Pedido\PedidoController@tableList');
        Route::get('pedidos/faturamento', 'Pedido\PedidoController@faturamento');
        Route::get('pedidos/faturar/{pedido_id}', 'Pedido\PedidoController@faturar');
        Route::resource('pedidos', 'Pedido\PedidoController', ['except' => ['create', 'edit']]);

        /**
         * Pedido Produto
         */
        Route::resource('pedido-produto', 'Pedido\PedidoProdutoController');

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
        Route::put('clientes/email/{cliente_id}', 'Cliente\ClienteController@changeEmail');
        Route::resource('clientes', 'Cliente\ClienteController', ['except' => ['create', 'edit', 'store']]);

        /**
         * Endereço
         */
        Route::resource('enderecos', 'Cliente\EnderecoController', ['except' => ['create', 'edit']]);

        /**
         * Produtos
         */
        Route::get('produtos/generate-sku/{old_sku?}', 'Produto\ProdutoController@gerenateSku');
        Route::get('produtos/check-sku/{sku}', 'Produto\ProdutoController@checkSku');
        Route::get('produtos/list', 'Produto\ProdutoController@tableList');
        Route::get('produtos/search/{term}', 'Produto\ProdutoController@search');
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

        /**
         * Inspeção Técnica
         */
        Route::post('inspecao_tecnica/verificar-reserva', 'Inspecao\InspecaoTecnicaController@verificarReserva');
        Route::post('inspecao_tecnica/reserva', 'Inspecao\InspecaoTecnicaController@reservar');
        Route::get('inspecao_tecnica/solicitadas', 'Inspecao\InspecaoTecnicaController@solicitadas');
        Route::get('inspecao_tecnica/fila', 'Inspecao\InspecaoTecnicaController@fila');
        Route::get('inspecao_tecnica/list', 'Inspecao\InspecaoTecnicaController@tableList');
        Route::get('inspecao_tecnica/get/{id}', 'Inspecao\InspecaoTecnicaController@showByPedidoProduto');
        Route::post('inspecao_tecnica/priority/{id}', 'Inspecao\InspecaoTecnicaController@changePriority');
        Route::resource('inspecao_tecnica', 'Inspecao\InspecaoTecnicaController');

        /**
         * Sugestão
         */
        Route::get('sugestoes/list', 'Sugestao\SugestaoController@tableList');
        Route::resource('sugestoes', 'Sugestao\SugestaoController');

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
