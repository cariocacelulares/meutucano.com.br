<?php

/**
 * Rota padrão para o Agnular
 */
Route::get('/', function () {
    return view('index');
});

Route::get('logs', '\Rap2hpoutre\LaravelLogViewer\LogViewerController@index');

/**
 * API
 */
Route::group(['prefix' => '/api', 'middleware' => 'sentry'], function () {
    /**
     * Auth
     */
    Route::post('authenticate', 'Auth\AuthenticateController@authenticate');
    Route::get('authenticate/user', 'Auth\AuthenticateController@getAuthenticatedUser');
    Route::get('token', 'Auth\AuthenticateController@refreshToken');

    Route::group(['middleware' => 'jwt.auth'], function () {
        /**
         * Usuario
         */
        Route::group(['namespace' => 'Usuario'], function () {
            Route::get('senhas/minhas', 'SenhaController@currentUserPassword');

            Route::post('check-password/{user_id}', 'UsuarioController@checkPassword');

            /**
             * Administração
             */
            Route::group(['middleware' => ['role:admin']], function () {
                /**
                 * Usuários
                 */
                Route::group(['prefix' => 'usuarios'], function () {
                    Route::get('list', 'UsuarioController@tableList');
                });
                Route::resource('usuarios', 'UsuarioController', ['except' => ['create', 'edit']]);

                /**
                 * Senhas
                 */
                Route::group(['prefix' => 'senhas'], function () {
                    Route::get('{id}', 'SenhaController@userPassword');
                });
                Route::resource('senhas', 'SenhaController', ['except' => ['create', 'edit']]);
            });
        });
    });
});
