<?php namespace App\Http\Middleware;

use Closure;

class ConvertJsonString
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
            return json_decode(stripslashes(urldecode($input))) ?: $input;
        }, $request->all()));

        return $next($request);
    }

}
