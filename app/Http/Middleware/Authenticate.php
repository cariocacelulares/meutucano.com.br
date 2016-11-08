<?php

namespace App\Http\Middleware;

use Closure;
use JWTAuth;
use Illuminate\Support\Facades\Auth;

class Authenticate
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string|null  $guard
     * @return mixed
     */
    public function handle($request, Closure $next, $guard = null)
    {
        if (Auth::guard($guard)->guest()) {
            if ($request->ajax() || $request->wantsJson()) {
                return response('Unauthorized.', 401);
            } else {
                return redirect()->guest('login');
            }
        }

        if (auth()->check()) {
            $sentry = app('sentry');
            $sentry->user_context([
                'id' => JWTAuth::parseToken()->authenticate()->id,
                'email' => JWTAuth::parseToken()->authenticate()->email,
                'username' => JWTAuth::parseToken()->authenticate()->username
            ]);
        }

        return $next($request);
    }
}
