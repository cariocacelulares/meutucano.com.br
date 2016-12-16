<?php namespace App\Http\Middleware;

use Closure;
use JWTAuth;

class SentryContext
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Closure                 $next
     *
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        try {
            $jwtAuth = JWTAuth::parseToken()->authenticate();

            if ($jwtAuth) {
                app('sentry')->user_context([
                    'id' => $jwtAuth->id,
                    'email' => $jwtAuth->email,
                    'username' => $jwtAuth->username
                ]);
            }
        } catch (\Exception $e) {
        }

        return $next($request);
    }
}
