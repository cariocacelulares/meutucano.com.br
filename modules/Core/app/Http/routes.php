<?php

// Extensão do chrome para o shopsystem
Route::get('orders/shopsystem/{taxvat}', 'Core\Http\Controllers\Order\OrderController@shopsystem');

Route::group(['middleware' => ['jwt.auth'], 'prefix' => 'api', 'namespace' => 'Core\Http\Controllers'], function () {

    Route::get('payment-methods', 'PaymentMethodController@index');
    Route::get('shipment-methods', 'ShipmentMethodController@index');
    Route::get('marketplaces', 'MarketplaceController@index');
    Route::get('zipcode/{zipcode}', 'ZipcodeController@getAddress');

    /**
     * Customer Addresses
     */
    Route::get('customers/addresses/from/{customer_id}', 'Customer\CustomerAddressController@listByCustomer');
    api('customers/addresses', 'Customer\CustomerAddressController', ['index']);

    /**
     * Customers
     */
    Route::get('customers/fetch', 'Customer\CustomerController@fetch');
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
    Route::get('orders/invoices/{id}/danfe', 'Order\OrderInvoiceController@danfe');
    api('orders/invoices', 'Order\OrderInvoiceController', ['index', 'update']);

    /**
     * Order Invoice Devolutions
     */
    Route::group(['prefix' => 'orders/invoices/devolutions'], function() {
        Route::post('upload', 'Order\OrderInvoiceDevolutionController@upload');
        Route::post('proceed/{devolution_id}', 'Order\OrderInvoiceDevolutionController@proceed');
        Route::get('{id}/danfe', 'Order\OrderInvoiceDevolutionController@danfe');
    });
    api('orders/invoices/devolutions', 'Order\OrderInvoiceDevolutionController', ['index', 'update']);

    /**
     * Order Shipment Devolutions
     */
    api('orders/shipments/devolutions', 'Order\OrderShipmentDevolutionController', ['index']);

    /**
     * Order Shipment Logistics
     */
    Route::put('orders/shipments/logistics/{id}/received', 'Order\OrderShipmentLogisticController@received');
    api('orders/shipments/logistics', 'Order\OrderShipmentLogisticController', ['index']);

    /**
     * Order Shipment Issues
     */
    api('orders/shipments/issues', 'Order\OrderShipmentIssueController', ['index']);

    /**
     * Order Shipment Monitors
     */
    api('orders/shipments/monitors', 'Order\OrderShipmentMonitorController', ['update']);

    /**
     * Order Shipments
     */
    Route::group(['prefix' => 'orders/shipments'], function () {
        Route::get('important', 'Order\OrderShipmentController@important');

        Route::get('{id}/history', 'Order\OrderShipmentController@history');
        Route::get('{id}/label', 'Order\OrderShipmentController@label');
        Route::put('{id}/refresh', 'Order\OrderShipmentController@refresh');
    });
    api('orders/shipments', 'Order\OrderShipmentController', ['index', 'update', 'destroy']);

    /**
     * Orders
     */
    Route::group(['prefix' => 'orders'], function () {
        Route::get('header', 'Order\OrderController@header');
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
    Route::get('lines/fetch', 'Product\LineController@fetch');
    api('lines', 'Product\LineController');

    /**
     * Brands
     */
    Route::get('brands/fetch', 'Product\BrandController@fetch');
    api('brands', 'Product\BrandController');

    /**
     * Product Serial Issues
     */
    api('products/serials/issues', 'Product\ProductSerialIssueController', ['show', 'update']);

    /**
     * Product Serial Defects
     */
    Route::get('products/serials/defects/header', 'Product\ProductSerialDefectController@header');
    api('products/serials/defects', 'Product\ProductSerialDefectController', ['show', 'update']);

    /**
     * Product Serials
     */
    Route::group(['prefix' => 'products/serials'], function() {
        Route::get('find/{serial}', 'Product\ProductSerialController@find');
        Route::get('check', 'Product\ProductSerialController@checkTransfer');
        Route::get('from/{depotProduct}', 'Product\ProductSerialController@listByDepotProduct');
        Route::get('generate/{listSize?}', 'Product\ProductSerialController@generate');

        Route::post('transfer', 'Product\ProductSerialController@transfer');
    });

    /**
     * Products
     */
    Route::group(['prefix' => 'products'], function() {
        Route::get('header', 'Product\ProductController@header');

        Route::get('{id}/graph/orders-period', 'Product\ProductController@graphOrderPeriod');
        Route::get('{id}/graph/cost-period', 'Product\ProductController@graphCostPeriod');
        Route::get('{id}/graph/orders-marketplace', 'Product\ProductController@graphOrderMarketplace');

        Route::get('find/{term}', 'Product\ProductController@find');
        Route::get('{id}/entry', 'Product\ProductController@lastDepotEntry');
    });
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
        Route::get('from/product/{sku}', 'Depot\DepotProductController@listByProduct');
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
