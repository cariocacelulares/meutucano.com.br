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

        Route::put('approve/{order_id}', 'OrderController@approve');
        Route::put('invoice/{order_id}', 'OrderController@invoice');
        Route::put('cancel/{order_id}', 'OrderController@cancel');

        Route::put('prioritize/{order_id}', 'OrderController@prioritize');
        Route::put('unprioritize/{order_id}', 'OrderController@unprioritize');

        Route::put('hold/{order_id}', 'OrderController@hold');
        Route::put('unhold/{order_id}', 'OrderController@unhold');
    });
    api('orders', 'Order\OrderController');

    /**
     * Lines
     */
    api('lines', 'Product\LineController');

    /**
     * Brands
     */
    api('brands', 'Product\BrandController');

    /**
     * Product Serials
     */
    Route::get('products/serials/find/{serial}', 'Product\ProductSerialController@find');

    /**
     * Product Defects
     */
    api('products/serials/defects', 'Product\ProductSerialDefectController');

    /**
     * Products
     */
    Route::get('products/find/{term}', 'Product\ProductController@find');
    api('products', 'Product\ProductController');

    /**
     * Suppliers
     */
    Route::get('suppliers/find/{term}', 'Supplier\SupplierController@find');
    api('suppliers', 'Supplier\SupplierController');

    /**
     * Depots
     */
    api('depots', 'Depot\DepotController');

    /*
    // /**
    //  * Stock
    //  */
    // Route::group(['prefix' => 'estoque', 'namespace' => 'Stock'], function () {
    //     Route::get('imei/generate', 'ImeiController@generate');
    // });
    //
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
});
