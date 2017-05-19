<?php namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    /**
     * The application's global HTTP middleware stack.
     *
     * These middleware are run during every request to your application.
     *
     * @var array
     */
    protected $middleware = [
        \Barryvdh\Cors\HandleCors::class,
        \App\Http\Middleware\TrimRequest::class,
        \Illuminate\Foundation\Http\Middleware\CheckForMaintenanceMode::class,
        // \Illuminate\Routing\Middleware\ThrottleRequests::class,
        // \Illuminate\Routing\Middleware\SubstituteBindings::class,
    ];

    /**
     * The application's route middleware groups.
     *
     * @var array
     */
    protected $middlewareGroups = [
    ];

    /**
     * The application's route middleware.
     *
     * These middleware may be assigned to groups or used individually.
     *
     * @var array
     */
    protected $routeMiddleware = [
        'throttle'    => \Illuminate\Routing\Middleware\ThrottleRequests::class,
        'jwt.auth'    => \Tymon\JWTAuth\Middleware\GetUserFromToken::class,
        'jwt.refresh' => \Tymon\JWTAuth\Middleware\RefreshToken::class,
        'role'        => \Zizaco\Entrust\Middleware\EntrustRole::class,
        'permission'  => \Zizaco\Entrust\Middleware\EntrustPermission::class,
        'ability'     => \Zizaco\Entrust\Middleware\EntrustAbility::class,
        'bindings'    => \Illuminate\Routing\Middleware\SubstituteBindings::class,
        'currentUser' => \App\Http\Middleware\AddUserToRequest::class,
        'convertJson' => \App\Http\Middleware\ConvertJsonString::class,
    ];
}
