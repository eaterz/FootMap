<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsRegular
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user() || $request->user()->role !== 'user') {
            // If user is admin, redirect to admin dashboard
            if ($request->user() && $request->user()->role === 'admin') {
                return redirect('/admin/dashboard');
            }

            abort(403, 'Unauthorized action.');
        }

        return $next($request);
    }
}
