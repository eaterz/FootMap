<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function toResponse($request)
    {
        $user = auth()->user();

        // Redirect admin users to admin dashboard
        if ($user && $user->role === 'admin') {
            return redirect()->intended('/admin/dashboard');
        }

        // Redirect regular users to user dashboard
        return redirect()->intended('/dashboard');
    }
}
