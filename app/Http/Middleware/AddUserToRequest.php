<?php namespace App\Http\Middleware;

use Closure;

class AddUserToRequest
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
        $request->merge([
            'user_id' => \Auth::user()->id ?: null
        ]);

        return $next($request);
    }

}
