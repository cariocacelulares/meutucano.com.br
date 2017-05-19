<?php namespace App\Http\Middleware;

use Closure;

class TrimRequest
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $request->merge(array_map(function($input) {
            return trim($input);
        }, $request->all()));

        return $next($request);
    }

}
