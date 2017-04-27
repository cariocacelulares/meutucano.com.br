<?php

// Extensão do chrome para o shopsystem
Route::get('pedidos/shopsystem/{taxvat}', 'Core\Http\Controllers\Pedido\PedidoController@shopsystem');

Route::group(['middleware' => ['jwt.auth'], 'prefix' => 'api', 'namespace' => 'Core\Http\Controllers'], function () {

    Route::get('cep/{cep}', 'Partials\CepController@getAddress');

    /**
     * Customers
     */
    Route::group(['prefix' => 'customers', 'namespace' => 'Customer'], function () {
        Route::get('detail/{cliente_id}', 'CustomerController@detail');
        Route::get('search/{term}', 'CustomerController@search');
    });
    api('customers', 'Customer\CustomerController');

    /**
     * Customer Addresses
     */
    Route::group(['prefix' => 'addresses', 'namespace' => 'Customer'], function () {
        Route::get('from/{customer_id}', 'CustomerAddressController@byClient');
    });
    api('addresses', 'Customer\CustomerAddressController');

    /**
     * Orders
     */
    Route::group(['prefix' => 'orders', 'namespace' => 'Order'], function () {
        Route::get('faturamento', 'OrderController@faturamento');
        Route::get('faturar/{order_id}', 'OrderController@faturar');

        Route::post('status/{order_id}', 'OrderController@alterarStatus');

        Route::put('priority/{order_id}', 'OrderController@prioridade');
        Route::put('hold/{order_id}', 'OrderController@segurar');

        Route::post('upload', 'UploadController@upload');
    });
    api('orders', 'Pedido\PedidoController');

    /**
     * Invoices
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
     * Produtos
     */
    Route::group(['prefix' => 'produtos', 'namespace' => 'Produto'], function () {
        Route::get('search/{term}', 'ProdutoController@search');
    });
    api('produtos', 'Produto\ProdutoController');

    /**
     * Marcas
     */
    api('marcas', 'Produto\MarcaController');

    /**
     * Linhas
     */
    api('linhas', 'Produto\LinhaController');

    /**
     * Atributos
     */
    Route::get('atributos/linha/{linha_id}', 'Produto\Linha\AtributoController@fromLinha');

    /**
     * Stock
     */
    Route::group(['prefix' => 'estoque', 'namespace' => 'Stock'], function () {
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
    });
    api('estoque/baixa', 'Stock\IssueController');

    /**
     * Supplier
     */
    Route::group(['prefix' => 'supplier', 'namespace' => 'Supplier'], function () {
    });
    Route::get('supplier/search/{term}', 'Supplier\SupplierController@search');
    api('supplier', 'Supplier\SupplierController');

    /**
     * Stock entry
     */
    Route::group(['prefix' => 'estoque/entrada', 'namespace' => 'Stock'], function () {
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
