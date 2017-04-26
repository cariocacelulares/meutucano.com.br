<?php

// Extensão do chrome para o shopsystem
Route::get('pedidos/shopsystem/{taxvat}', 'Core\Http\Controllers\Pedido\PedidoController@shopsystem');

Route::group(['middleware' => ['jwt.auth'], 'prefix' => 'api', 'namespace' => 'Core\Http\Controllers'], function () {

    Route::get('cep/{cep}', 'Partials\CepController@getAddress');

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
    api('pedido-produtos', 'Pedido\PedidoProdutoController');

    /**
    * Notas
    */
    api('notas', 'Pedido\NotaController');

    /**
    * Comentarios
    */
    Route::get('comentarios/{pedido_id}', 'Pedido\ComentarioController@commentsFromOrder');
    api('comentarios', 'Pedido\ComentarioController');

    /**
    * Ligações
    */
    Route::get('ligacoes/{pedido_id}', 'Pedido\LigacaoController@ligacoesFromOrder');
    api('ligacoes', 'Pedido\LigacaoController');

    /**
     * Faturamento
     */
    Route::group(['prefix' => 'notas', 'namespace' => 'Pedido'], function () {
        Route::get('faturar/{pedido_id}', 'NotaController@faturar');
    });

    /**
     * Código de rastreio
     */
    Route::get('codigos/gerar/{servico}', 'Pedido\FaturamentoCodigoController@getTrakingCode');

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
    api('pedidos', 'Pedido\PedidoController');

    /**
     * Produtos
     */
    Route::group(['prefix' => 'produtos', 'namespace' => 'Produto'], function () {
        Route::get('list', 'ProdutoController@tableList');
        Route::get('search/{term}', 'ProdutoController@search');
    });
    api('produtos', 'Produto\ProdutoController');

    /**
     * Marcas
     */
    Route::get('marcas/list', 'Produto\MarcaController@tableList');
    api('marcas', 'Produto\MarcaController');

    /**
     * Linhas
     */
    Route::get('linhas/list', 'Produto\LinhaController@tableList');
    api('linhas', 'Produto\LinhaController');

    /**
     * Atributos
     */
    Route::get('atributos/linha/{linha_id}', 'Produto\Linha\AtributoController@fromLinha');

    /**
     * Clientes
     */
    Route::group(['prefix' => 'customers', 'namespace' => 'Customer'], function () {
        Route::get('detail/{cliente_id}', 'CustomerController@detail');
        Route::get('list', 'CustomerController@tableList');
        Route::get('search/{term}', 'CustomerController@search');
    });
    api('customers', 'Customer\CustomerController');

    /**
     * Endereço
     */
    Route::group(['prefix' => 'addresses', 'namespace' => 'Customer'], function () {
        Route::get('from/{customer_id}', 'CustomerAddressController@byClient');
    });
    api('addresses', 'Customer\CustomerAddressController');

    /**
     * Stock
     */
    Route::group(['prefix' => 'estoque', 'namespace' => 'Stock'], function () {
        Route::get('list', 'StockController@tableList');
        Route::get('imei/generate', 'ImeiController@generate');
    });
    api('estoque', 'Stock\StockController');

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
    api('produto-estoque', 'Produto\ProductStockController');

    /**
     * Product imei
     */
    Route::group(['prefix' => 'produto-imei', 'namespace' => 'Produto'], function () {
        Route::get('list/{sku}', 'ProductImeiController@listBySku');
        Route::post('parse', 'ProductImeiController@parseImeis');
    });
    api('produto-imei', 'Produto\ProductImeiController');

    /**
     * Stock removal
     */
    Route::group(['prefix' => 'estoque/retirada', 'namespace' => 'Stock'], function () {
        Route::get('list', 'RemovalController@tableList');
        Route::post('fechar/{id}', 'RemovalController@close');
    });
    api('estoque/retirada', 'Stock\RemovalController');

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
    api('estoque/retirada/produto', 'Stock\RemovalProductController');

    /**
     * Stock issue
     */
    Route::group(['prefix' => 'estoque/baixa', 'namespace' => 'Stock'], function () {
        Route::get('list', 'IssueController@tableList');
    });
    api('estoque/baixa', 'Stock\IssueController');

    /**
     * Supplier
     */
    Route::group(['prefix' => 'supplier', 'namespace' => 'Supplier'], function () {
        Route::get('list', 'SupplierController@tableList');
    });
    Route::get('supplier/search/{term}', 'Supplier\SupplierController@search');
    api('supplier', 'Supplier\SupplierController');

    /**
     * Stock entry
     */
    Route::group(['prefix' => 'estoque/entrada', 'namespace' => 'Stock'], function () {
        Route::get('list', 'EntryController@tableList');
        Route::post('confirm/{id}', 'EntryController@confirm');
    });
    api('estoque/entrada', 'Stock\EntryController');

    /**
     * Stock entry invoice
     */
    Route::group(['prefix' => 'estoque/entrada/nota', 'namespace' => 'Stock\Entry'], function () {
        Route::post('upload', 'InvoiceController@upload');

        Route::get('danfe/{id}/{retorno?}', 'InvoiceController@danfe');
    });
    api('estoque/entrada/nota', 'Stock\Entry\InvoiceController');

    /**
     * Product defect
     */
    Route::group(['prefix' => 'produto/defeito', 'namespace' => 'Produto'], function () {
        Route::get('list', 'DefectController@tableList');
    });
    api('produto/defeito', 'Produto\DefectController');

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
