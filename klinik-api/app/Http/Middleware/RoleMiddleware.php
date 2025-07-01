<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        // Check if user is authenticated
        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated'
            ], 401);
        }

        // Check if user has any of the required roles
        if (!empty($roles) && !$user->hasAnyRole($roles)) {
            return response()->json([
                'message' => 'Forbidden. Insufficient privileges.',
                'required_roles' => $roles,
                'user_role' => $user->role
            ], 403);
        }

        return $next($request);
    }
}