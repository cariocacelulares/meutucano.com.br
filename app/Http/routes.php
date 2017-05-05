<?php

Route::get('/', function () { return 'Hello Toucan!'; });

/**
 * API
 */
Route::group(['prefix' => '/api'], function () {

    Route::post('authenticate', 'Auth\AuthenticateController@authenticate');

    Route::group(['middleware' => 'jwt.auth'], function () {

        Route::get('file/{path}/{filename}', function ($path, $filename) {
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

        Route::get('authenticate/user', 'Auth\AuthenticateController@getAuthenticatedUser');
        Route::get('token', 'Auth\AuthenticateController@refreshToken');

        Route::group(['namespace' => 'User'], function () {
            api('users', 'UserController');

            Route::group(['prefix' => 'passwords'], function() {
                Route::get('from/{user_id}', 'UserPasswordController@listFromUser');
                Route::get('current', 'UserPasswordController@listCurrentUser');
            });
            api('passwords', 'UserPasswordController', ['index', 'show']);
        });
    });
});
