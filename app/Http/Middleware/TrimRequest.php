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
        $input = $request->all();
        array_walk_recursive($input, function (&$item, $key) {
            if (is_string($item)) {
                $item = trim($item);
            }
        });

        $request->merge($input);

        return $next($request);
    }

}
