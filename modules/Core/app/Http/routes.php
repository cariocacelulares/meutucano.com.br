<?php

// Extensão do chrome para o shopsystem
Route::get('orders/shopsystem/{taxvat}', 'Core\Http\Controllers\Order\OrderController@shopsystem');

Route::group(['middleware' => ['jwt.auth'], 'prefix' => 'api', 'namespace' => 'Core\Http\Controllers'], function () {

    Route::get('zipcode/{zipcode}', 'ZipcodeController@getAddress');

    /**
     * Customers
     */
    api('customers', 'Customer\CustomerController');

    /**
     * Customer Addresses
     */
    Route::get('customers/addresses/from/{customer_id}', 'Customer\CustomerAddressController@listByCustomer');
    api('customers/addresses', 'Customer\CustomerAddressController', ['index']);

    /**
    * Order Comments
    */
    Route::get('orders/comments/from/{order_id}', 'Order\OrderCommentController@listByOrder');
    api('orders/comments', 'Order\OrderCommentController', ['index', 'update']);

    /**
    * Order Calls
    */
    Route::get('orders/calls/from/{order_id}', 'Order\OrderCallController@listByOrder');
    api('orders/calls', 'Order\OrderCallController', ['index', 'update']);

    /**
     * Order Invoices
     */
    Route::get('orders/invoices/danfe/{invoice_id}/{return?}', 'Order\OrderInvoiceController@danfe');
    api('orders/invoices', 'Order\OrderInvoiceController', ['index', 'update']);

    /**
     * Order Invoice Devolutions
     */
    Route::group(['prefix' => 'orders/invoices/devolutions'], function() {
        Route::post('upload', 'Order\OrderInvoiceDevolutionController@upload');
        Route::post('proceed/{devolution_id}', 'Order\OrderInvoiceDevolutionController@proceed');
        Route::get('danfe/{devolution_id}/{retorno?}', 'Order\OrderInvoiceDevolutionController@danfe');
    });
    api('orders/invoices/devolutions', 'Order\OrderInvoiceDevolutionController', ['index', 'update']);

    /**
     * Orders
     */
    Route::group(['prefix' => 'orders', 'namespace' => 'Order'], function () {
        Route::get('invoiceable', 'OrderController@invoiceable');
        Route::get('invoice/{order_id}', 'OrderController@invoice');

        Route::put('prioritize/{order_id}', 'OrderController@prioritize');
        Route::put('unprioritize/{order_id}', 'OrderController@unprioritize');

        Route::put('hold/{order_id}', 'OrderController@hold');
        Route::put('unhold/{order_id}', 'OrderController@unhold');

        // Route::post('upload', 'UploadController@upload');
    });
    api('orders', 'Order\OrderController');


    /**
    * Order Product
    */
    Route::group(['prefix' => 'order-produtos', 'namespace' => 'Order'], function () {
        Route::get('list/{sku}', 'OrderProductController@listBySku');
    });
    api('order-produtos', 'Order\OrderProductController');


    /**
     * Código de rastreio
     */
    // Route::get('codigos/gerar/{servico}', 'Order\FaturamentoCodigoController@getTrakingCode');

    /**
     * Products
     */
    // Route::group(['prefix' => 'produtos', 'namespace' => 'Product'], function () {
    //     Route::get('search/{term}', 'ProductController@search');
    // });
    // api('produtos', 'Product\ProductController');
    //
    // /**
    //  * Marcas
    //  */
    // api('marcas', 'Product\MarcaController');
    //
    // /**
    //  * Linhas
    //  */
    // api('linhas', 'Product\LinhaController');
    //
    // /**
    //  * Atributos
    //  */
    // Route::get('atributos/linha/{linha_id}', 'Product\Linha\AtributoController@fromLinha');
    //
    // /**
    //  * Stock
    //  */
    // Route::group(['prefix' => 'estoque', 'namespace' => 'Stock'], function () {
    //     Route::get('imei/generate', 'ImeiController@generate');
    // });
    // api('estoque', 'Stock\StockController');
    //
    // /**
    //  * Product stock
    //  */
    // Route::group(['prefix' => 'produto-estoque', 'namespace' => 'Product'], function () {
    //     Route::get('list/{sku}', 'ProductStockController@listBySku');
    //     Route::get('slug/{slug}', 'ProductStockController@listBySlug');
    //     Route::post('refresh', 'ProductStockController@refresh');
    //     Route::get('adicionar/{sku}', 'ProductStockController@addOptions');
    //     Route::get('transferencia/{id}', 'ProductStockController@transferOptions');
    //     Route::get('transferencia/verificar/{id}/{imei}', 'ProductStockController@verifyTransfer');
    //     Route::post('transferencia', 'ProductStockController@transfer');
    // });
    // api('produto-estoque', 'Product\ProductStockController');
    //
    // /**
    //  * Product imei
    //  */
    // Route::group(['prefix' => 'produto-imei', 'namespace' => 'Product'], function () {
    //     Route::get('list/{sku}', 'ProductImeiController@listBySku');
    //     Route::post('parse', 'ProductImeiController@parseImeis');
    // });
    // api('produto-imei', 'Product\ProductImeiController');
    //
    // /**
    //  * Stock removal
    //  */
    // Route::group(['prefix' => 'estoque/retirada', 'namespace' => 'Stock'], function () {
    //     Route::post('fechar/{id}', 'RemovalController@close');
    // });
    // api('estoque/retirada', 'Stock\RemovalController');
    //
    // /**
    //  * Stock removal product
    //  */
    // Route::group(['prefix' => 'estoque/retirada/produto', 'namespace' => 'Stock'], function () {
    //     Route::get('verificar/{imei}', 'RemovalProductController@verify');
    //     Route::get('verificar/{imei}/{stockRemovalId}', 'RemovalProductController@check');
    //     Route::post('confirmar/{stockRemovalId}', 'RemovalProductController@confirm');
    //     Route::post('retornar/{stockRemovalId}', 'RemovalProductController@return');
    //     Route::post('status/{id}', 'RemovalProductController@changeStatus');
    // });
    // api('estoque/retirada/produto', 'Stock\RemovalProductController');
    //
    // /**
    //  * Stock issue
    //  */
    // Route::group(['prefix' => 'estoque/baixa', 'namespace' => 'Stock'], function () {
    // });
    // api('estoque/baixa', 'Stock\IssueController');
    //
    // /**
    //  * Supplier
    //  */
    // Route::group(['prefix' => 'supplier', 'namespace' => 'Supplier'], function () {
    // });
    // Route::get('supplier/search/{term}', 'Supplier\SupplierController@search');
    // api('supplier', 'Supplier\SupplierController');
    //
    // /**
    //  * Stock entry
    //  */
    // Route::group(['prefix' => 'estoque/entrada', 'namespace' => 'Stock'], function () {
    //     Route::post('confirm/{id}', 'EntryController@confirm');
    // });
    // api('estoque/entrada', 'Stock\EntryController');
    //
    // /**
    //  * Stock entry invoice
    //  */
    // Route::group(['prefix' => 'estoque/entrada/nota', 'namespace' => 'Stock\Entry'], function () {
    //     Route::post('upload', 'InvoiceController@upload');
    //
    //     Route::get('danfe/{id}/{retorno?}', 'InvoiceController@danfe');
    // });
    // api('estoque/entrada/nota', 'Stock\Entry\InvoiceController');
    //
    // /**
    //  * Product defect
    //  */
    // Route::group(['prefix' => 'produto/defeito', 'namespace' => 'Product'], function () {
    // });
    // api('produto/defeito', 'Product\DefectController');
    //
    // /**
    //  * Partials
    //  */
    // Route::group(['namespace' => 'Partials'], function () {
    //     Route::get('search', 'SearchController@search');
    // });
    //
    // /**
    //  * Relatórios
    //  */
    // Route::group(['middleware' => ['role:admin'], 'namespace' => 'Relatorio', 'prefix' => 'relatorios'], function () {
    //     // ICMS
    //     Route::get('icms', 'ICMSController@icms');
    //
    //     // Inventário
    //     Route::post('inventario', 'InventarioController@relatorio');
    //     Route::get('inventario/{return_type}', 'InventarioController@relatorio');
    // });
});
