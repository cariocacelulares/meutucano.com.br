<?php

// Extensão do chrome para o shopsystem
Route::get('orders/shopsystem/{taxvat}', 'Core\Http\Controllers\Order\OrderController@shopsystem');

Route::group(['middleware' => ['jwt.auth'], 'prefix' => 'api', 'namespace' => 'Core\Http\Controllers'], function () {

    Route::get('zipcode/{zipcode}', 'ZipcodeController@getAddress');

    /**
     * Customer Addresses
     */
    Route::get('customers/addresses/from/{customer_id}', 'Customer\CustomerAddressController@listByCustomer');
    api('customers/addresses', 'Customer\CustomerAddressController', ['index']);

    /**
     * Customers
     */
    api('customers', 'Customer\CustomerController');

    /**
    * Order Comments
    */
    Route::get('orders/comments/from/{order_id}', 'Order\OrderCommentController@listByOrder');
    Route::get('orders/comments/from/{order_id}/important', 'Order\OrderCommentController@listImportantByOrder');
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
    Route::group(['prefix' => 'orders'], function () {
        Route::get('invoiceable', 'Order\OrderController@invoiceable');

        Route::put('approve/{order_id}', 'Order\OrderController@approve');
        Route::put('invoice/{order_id}', 'Order\OrderController@invoice');
        Route::put('cancel/{order_id}', 'Order\OrderController@cancel');

        Route::put('prioritize/{order_id}', 'Order\OrderController@prioritize');
        Route::put('unprioritize/{order_id}', 'Order\OrderController@unprioritize');

        Route::put('hold/{order_id}', 'Order\OrderController@hold');
        Route::put('unhold/{order_id}', 'Order\OrderController@unhold');
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
    Route::group(['prefix' => 'products/serials'], function() {
        Route::get('find/{serial}', 'Product\ProductSerialController@find');
        Route::get('check', 'Product\ProductSerialController@checkTransfer');

        Route::post('transfer', 'Product\ProductSerialController@transfer');
    });

    /**
     * Product Serial Issues
     */
    api('products/serials/issues', 'Product\ProductSerialIssueController', ['show', 'update']);

    /**
     * Product Serial Defects
     */
    api('products/serials/defects', 'Product\ProductSerialDefectController', ['show', 'update']);

    /**
     * Products
     */
    Route::get('products/find/{term}', 'Product\ProductController@find');
    Route::get('products/{id}/entry', 'Product\ProductController@lastDepotEntry');
    api('products', 'Product\ProductController');

    /**
     * Suppliers
     */
    Route::get('suppliers/find/{term}', 'Supplier\SupplierController@find');
    api('suppliers', 'Supplier\SupplierController');

    /**
     * Depot Entry Invoices
     */
    Route::group(['prefix' => 'depots/entries/invoices'], function() {
        Route::get('parse/{id}', 'Depot\DepotEntryInvoiceController@parse');
        Route::get('danfe/{id}/{retorno?}', 'Depot\DepotEntryInvoiceController@danfe');
    });
    api('depots/entries/invoices', 'Depot\DepotEntryInvoiceController');

    /**
     * Depot Entries
     */
    Route::put('depots/entries/confirm/{id}', 'Depot\DepotEntryController@confirm');
    api('depots/entries', 'Depot\DepotEntryController');

    /**
     * Depot Products
     */
    Route::group(['prefix' => 'depots/products'], function () {
        Route::get('from/product/{sku}/{slug?}', 'Depot\DepotProductController@listByProduct');
        Route::get('from/depot/{slug}', 'Depot\DepotProductController@listByDepot');
    });
    api('depots/products', 'Depot\DepotProductController', ['index', 'show', 'update']);

    /**
     * Depot Withdraw Products
     */
    Route::group(['prefix' => 'depots/withdraws/products'], function () {
        Route::get('check/confirm', 'Depot\DepotWithdrawProductcontroller@checkConfirm');
        Route::get('check/return', 'Depot\DepotWithdrawProductcontroller@checkReturn');

        Route::put('confirm', 'Depot\DepotWithdrawProductcontroller@confirm');
        Route::put('return', 'Depot\DepotWithdrawProductcontroller@return');
    });
    api('depots/withdraws/products', 'Depot\DepotWithdrawProductcontroller');

    /**
     * Depot Withdraws
     */
     Route::group(['prefix' => 'depots/withdraws'], function () {
         Route::put('close/{id}', 'Depot\DepotWithdrawController@close');
     });
    api('depots/withdraws', 'Depot\DepotWithdrawController');

    /**
     * Depots
     */
    Route::get('depots/from/product/{sku}/available', 'Depot\DepotController@listByAvailableFromProduct');
    Route::get('depots/transferable/{depotProductId}', 'Depot\DepotController@listByTransferable');
    api('depots', 'Depot\DepotController');
});
