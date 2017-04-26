<?php

// Extensão do chrome para o shopsystem
Route::get('pedidos/shopsystem/{taxvat}', 'Core\Http\Controllers\Pedido\PedidoController@shopsystem');

Route::group(['middleware' => ['jwt.auth'], 'prefix' => 'api', 'namespace' => 'Core\Http\Controllers'], function () {
    /**
     * CEP
     */
     Route::get('cep/{cep}', 'Partials\CepController@getAddress');

    /**
     * Calls from storage
     */
     Route::get('storage/{path}/{filename}', function ($path, $filename) {
        $path = storage_path("app/public/{$path}/{$filename}");

        if (!Illuminate\Support\Facades\File::exists($path)) {
            abort(404);
        }

        $file     = Illuminate\Support\Facades\File::get($path);
        $type     = Illuminate\Support\Facades\File::mimeType($path);
        $response = Illuminate\Support\Facades\Response::make($file, 200);

        $response->header("Content-Type", $type);

        return $response;
     });

    /**
    * Notas
    */
    Route::group(['prefix' => 'notas', 'namespace' => 'Pedido'], function () {
        Route::get('danfe/{id}/{retorno?}', 'NotaController@danfe');
    });

    /**
     * Devolucao
     */
     Route::post('notas/devolucao/upload', 'Pedido\Nota\DevolucaoController@upload');
     Route::post('notas/devolucao/proceed/{id}', 'Pedido\Nota\DevolucaoController@proceed');
     Route::get('notas/devolucao/danfe/{id}/{retorno?}', 'Pedido\Nota\DevolucaoController@danfe');

    /**
    * Pedido Produto
    */
    Route::group(['prefix' => 'pedido-produtos', 'namespace' => 'Pedido'], function () {
        Route::get('list/{sku}', 'PedidoProdutoController@listBySku');
    });
    Route::resource('pedido-produtos', 'Pedido\PedidoProdutoController', ['except' => ['create', 'edit']]);

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
    * Ligações
    */
    Route::get('ligacoes/{pedido_id}', 'Pedido\LigacaoController@ligacoesFromOrder');
    Route::resource('ligacoes', 'Pedido\LigacaoController', ['except' => ['create', 'edit']]);

    /**
     * Faturamento
     */
    Route::group(['middleware' => ['role:admin|faturamento']], function () {
        Route::group(['prefix' => 'notas', 'namespace' => 'Pedido'], function () {
            Route::get('faturar/{pedido_id}', 'NotaController@faturar');
        });

        /**
         * Código de rastreio
         */
        Route::get('codigos/gerar/{servico}', 'Pedido\FaturamentoCodigoController@getTrakingCode');
    });

    /**
     * Pedidos
     */
    Route::group(['prefix' => 'pedidos', 'namespace' => 'Pedido'], function () {
        Route::get('list', 'PedidoController@tableList');
        Route::get('faturamento', 'PedidoController@faturamento');
        Route::get('faturar/{pedido_id}', 'PedidoController@faturar');

        Route::post('status/{pedido_id}', 'PedidoController@alterarStatus');

        Route::put('prioridade/{pedido_id}', 'PedidoController@prioridade');
        Route::put('segurar/{pedido_id}', 'PedidoController@segurar');

        Route::post('upload', 'UploadController@upload');
    });
    Route::resource('pedidos', 'Pedido\PedidoController', ['except' => ['create', 'edit']]);

    /**
     * Produtos
     */
    Route::group(['prefix' => 'produtos', 'namespace' => 'Produto'], function () {
        Route::get('list', 'ProdutoController@tableList');
        Route::get('search/{term}', 'ProdutoController@search');
    });
    Route::resource('produtos', 'Produto\ProdutoController', ['except' => ['create', 'edit']]);

    /**
     * Marcas
     */
    Route::get('marcas/list', 'Produto\MarcaController@tableList');
    Route::resource('marcas', 'Produto\MarcaController', ['except' => ['create', 'edit']]);

    /**
     * Linhas
     */
    Route::get('linhas/list', 'Produto\LinhaController@tableList');
    Route::resource('linhas', 'Produto\LinhaController', ['except' => ['create', 'edit']]);

    /**
     * Atributos
     */
    Route::get('atributos/linha/{linha_id}', 'Produto\Linha\AtributoController@fromLinha');

    /**
     * Clientes
     */
    Route::group(['prefix' => 'clientes', 'namespace' => 'Cliente'], function () {
        Route::get('detail/{cliente_id}', 'ClienteController@detail');
        Route::get('list', 'ClienteController@tableList');
        Route::get('search/{term}', 'ClienteController@search');
    });
    Route::resource('clientes', 'Cliente\ClienteController', ['except' => ['create', 'edit']]);

    /**
     * Endereço
     */
    Route::group(['prefix' => 'enderecos', 'namespace' => 'Cliente'], function () {
        Route::get('cliente/{clienteId}', 'EnderecoController@byClient');
    });
    Route::resource('enderecos', 'Cliente\EnderecoController', ['except' => ['create', 'edit']]);

    /**
     * Stock
     */
    Route::group(['prefix' => 'estoque', 'namespace' => 'Stock'], function () {
        Route::get('list', 'StockController@tableList');
        Route::get('imei/generate', 'ImeiController@generate');
    });
    Route::resource('estoque', 'Stock\StockController', ['except' => ['create', 'edit']]);

    /**
     * Product stock
     */
    Route::group(['prefix' => 'produto-estoque', 'namespace' => 'Produto'], function () {
        Route::get('list/{sku}', 'ProductStockController@listBySku');
        Route::get('slug/{slug}', 'ProductStockController@listBySlug');
        Route::post('refresh', 'ProductStockController@refresh');
        Route::get('adicionar/{sku}', 'ProductStockController@addOptions');
        Route::get('transferencia/{id}', 'ProductStockController@transferOptions');
        Route::get('transferencia/verificar/{id}/{imei}', 'ProductStockController@verifyTransfer');
        Route::post('transferencia', 'ProductStockController@transfer');
    });
    Route::resource('produto-estoque', 'Produto\ProductStockController', ['except' => ['create', 'edit']]);

    /**
     * Product imei
     */
    Route::group(['prefix' => 'produto-imei', 'namespace' => 'Produto'], function () {
        Route::get('list/{sku}', 'ProductImeiController@listBySku');
        Route::post('parse', 'ProductImeiController@parseImeis');
    });
    Route::resource('produto-imei', 'Produto\ProductImeiController', ['except' => ['create', 'edit']]);

    /**
     * Stock removal
     */
    Route::group(['prefix' => 'estoque/retirada', 'namespace' => 'Stock'], function () {
        Route::get('list', 'RemovalController@tableList');
        Route::post('fechar/{id}', 'RemovalController@close');
    });
    Route::resource('estoque/retirada', 'Stock\RemovalController', ['except' => ['create', 'edit']]);

    /**
     * Stock removal product
     */
    Route::group(['prefix' => 'estoque/retirada/produto', 'namespace' => 'Stock'], function () {
        Route::get('verificar/{imei}', 'RemovalProductController@verify');
        Route::get('verificar/{imei}/{stockRemovalId}', 'RemovalProductController@check');
        Route::post('confirmar/{stockRemovalId}', 'RemovalProductController@confirm');
        Route::post('retornar/{stockRemovalId}', 'RemovalProductController@return');
        Route::post('status/{id}', 'RemovalProductController@changeStatus');
    });
    Route::resource('estoque/retirada/produto', 'Stock\RemovalProductController', ['except' => ['create', 'edit']]);

    /**
     * Stock issue
     */
    Route::group(['prefix' => 'estoque/baixa', 'namespace' => 'Stock'], function () {
        Route::get('list', 'IssueController@tableList');
    });
    Route::resource('estoque/baixa', 'Stock\IssueController', ['except' => ['create', 'edit']]);

    /**
     * Supplier
     */
    Route::group(['prefix' => 'supplier', 'namespace' => 'Supplier'], function () {
        Route::get('list', 'SupplierController@tableList');
    });
    Route::get('supplier/search/{term}', 'Supplier\SupplierController@search');
    Route::resource('supplier', 'Supplier\SupplierController', ['except' => ['create', 'edit']]);

    /**
     * Stock entry
     */
    Route::group(['prefix' => 'estoque/entrada', 'namespace' => 'Stock'], function () {
        Route::get('list', 'EntryController@tableList');
        Route::post('confirm/{id}', 'EntryController@confirm');
    });
    Route::resource('estoque/entrada', 'Stock\EntryController', ['except' => ['create', 'edit']]);

    /**
     * Stock entry invoice
     */
    Route::group(['prefix' => 'estoque/entrada/nota', 'namespace' => 'Stock\Entry'], function () {
        Route::post('upload', 'InvoiceController@upload');

        Route::get('danfe/{id}/{retorno?}', 'InvoiceController@danfe');
    });
    Route::resource('estoque/entrada/nota', 'Stock\Entry\InvoiceController', ['except' => ['create', 'edit']]);

    /**
     * Product defect
     */
    Route::group(['prefix' => 'produto/defeito', 'namespace' => 'Produto'], function () {
        Route::get('list', 'DefectController@tableList');
    });
    Route::resource('produto/defeito', 'Produto\DefectController', ['except' => ['create', 'edit']]);

    /**
     * Partials
     */
    Route::group(['namespace' => 'Partials'], function () {
        Route::get('search', 'SearchController@search');
    });

    /**
     * Relatórios
     */
    Route::group(['middleware' => ['role:admin'], 'namespace' => 'Relatorio', 'prefix' => 'relatorios'], function () {
        // ICMS
        Route::get('icms', 'ICMSController@icms');

        // Inventário
        Route::post('inventario', 'InventarioController@relatorio');
        Route::get('inventario/{return_type}', 'InventarioController@relatorio');
    });
});
