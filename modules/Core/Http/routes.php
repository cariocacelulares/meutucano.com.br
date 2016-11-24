<?php

// Extensão do chrome para o shopsystem
Route::get('pedidos/shopsystem/{taxvat}', 'Modules\Core\Http\Controllers\Pedido\PedidoController@shopsystem');

Route::group(['middleware' => ['sentry', 'jwt.auth'], 'prefix' => 'api', 'namespace' => 'Modules\Core\Http\Controllers'], function() {
    /**
     * Rastreios
     */
    Route::group(['prefix' => 'rastreios', 'namespace' => 'Pedido'], function() {
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
    Route::resource('rastreios', 'Pedido\RastreioController', ['except' => ['create', 'edit'], 'middleware' => 'role:admin|atendimento']);

    /**
     * Atendimento
     */
    Route::group(['middleware' => 'role:admin|atendimento', 'namespace' => 'Pedido\Rastreio'], function() {
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

    /**
     * Notas
     */
    Route::group(['prefix' => 'notas', 'namespace' => 'Pedido'], function() {
        Route::get('xml/{id}/{devolucao}', 'NotaController@xml');
        Route::get('danfe/{id}/{retorno?}', 'NotaController@danfe');
        Route::post('email/{id}', 'NotaController@email');
    });

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
     * Faturamento
     */
    Route::group(['middleware' => ['role:admin|faturamento']], function() {
        Route::group(['prefix' => 'notas', 'namespace' => 'Pedido'], function() {
            Route::get('faturamento', 'NotaController@notasFaturamento');
            Route::get('faturar/{pedido_id}', 'NotaController@faturar');
        });
    });

    /**
     * Pedidos
     */
    Route::group(['prefix' => 'pedidos', 'namespace' => 'Pedido'], function() {
        Route::get('cidades/{uf}', 'PedidoController@cidades');
        Route::get('total-orders-status', 'PedidoController@totalOrdersByStatus');
        Route::get('total-orders-date', 'PedidoController@totalOrdersByDate');
        Route::get('total-orders/{mes?}/{ano?}', 'PedidoController@totalOrders');
        Route::get('cancelamento/{id}', 'PedidoController@imagemCancelamento');
        Route::get('list', 'PedidoController@tableList');
        Route::get('faturamento', 'PedidoController@faturamento');
        Route::get('faturar/{pedido_id}', 'PedidoController@faturar');

        Route::post('status/{pedido_id}', 'PedidoController@alterarStatus');

        Route::put('prioridade/{pedido_id}', 'PedidoController@prioridade');
        Route::put('segurar/{pedido_id}', 'PedidoController@segurar');
    });
    Route::resource('pedidos', 'Pedido\PedidoController', ['except' => ['create', 'edit']]);

    /**
     * Produtos
     */
    Route::group(['prefix' => 'produtos', 'namespace' => 'Produto'], function() {
        Route::get('generate-sku/{old_sku?}', 'ProdutoController@gerenateSku');
        Route::get('check-sku/{sku}', 'ProdutoController@checkSku');
        Route::get('list', 'ProdutoController@tableList');
        Route::get('search/{term}', 'ProdutoController@search');
    });
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
     * Clientes
     */
    Route::group(['prefix' => 'clientes', 'namespace' => 'Cliente'], function() {
        Route::get('detail/{cliente_id}', 'ClienteController@detail');
        Route::get('list', 'ClienteController@tableList');
        Route::put('email/{cliente_id}', 'ClienteController@changeEmail');
    });
    Route::resource('clientes', 'Cliente\ClienteController', ['except' => ['create', 'edit', 'store']]);

    /**
     * Endereço
     */
    Route::resource('enderecos', 'Cliente\EnderecoController', ['except' => ['create', 'edit']]);
});
