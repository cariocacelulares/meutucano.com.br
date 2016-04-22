<?php


Route::get('/', function () {
    return view('index');
});


/**
 * Define REST route
 *
 * @param $path
 * @param $controller
 */
function rest($path, $controller)
{
    Route::resource($path, $controller,
        ['except' => ['create', 'edit']]);
}

/**
 * API
 */

Route::group(['prefix' => '/api'], function() {
    Route::post('authenticate', 'AuthenticateController@authenticate');
    Route::get('authenticate/user', 'AuthenticateController@getAuthenticatedUser');
    Route::get('token', 'AuthenticateController@refreshToken');

//    Route::group(['middleware' => 'jwt.auth'], function() {
//        Route::controller('metas', 'Meta\MetaController');

        /**
         * REST routes
         */
        Route::post('upload', 'UploadController@upload');
        Route::get('search',  'SearchController@search');

        rest('pedidos', 'Pedido\PedidoController');

        Route::put('rastreios/refresh_all',         'Pedido\PedidoRastreioController@refreshAll');
        Route::put('rastreios/refresh_status/{id}', 'Pedido\PedidoRastreioController@refreshStatus');
        Route::put('rastreios/edit/{id}',           'Pedido\PedidoRastreioController@edit');
        Route::get('rastreios/etiqueta/{id}',       'Pedido\PedidoRastreioController@etiqueta');
        rest('rastreios', 'Pedido\PedidoRastreioController');

        Route::get('notas/xml/{id}', 'Pedido\PedidoNotaController@xml');
        Route::get('notas/danfe/{id}', 'Pedido\PedidoNotaController@danfe');
        rest('notas', 'Pedido\PedidoNotaController');

        Route::put('pis/edit/{id}', 'Pedido\PedidoRastreioPiController@edit');
        rest('pis', 'Pedido\PedidoRastreioPiController');

        Route::put('devolucoes/edit/{id}', 'Pedido\PedidoRastreioDevolucaoController@edit');
        rest('devolucoes', 'Pedido\PedidoRastreioDevolucaoController');

        Route::put('logisticas/edit/{id}', 'Pedido\PedidoRastreioLogisticaController@edit');
        rest('logisticas', 'Pedido\PedidoRastreioLogisticaController');
//    });
});