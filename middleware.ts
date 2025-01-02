import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    // Define public paths that don't require authentication
    const isPublicPath = path === '/' || path === '/login' || path === '/cadastro' || path === '/termos' || path === '/privacidade'

    // Get the token from the request
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

    // If the path is not public and there's no token, redirect to login
    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // If we're on the login page and we have a token, redirect to home
    if (path === '/login' && token) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    // Log the request (you might want to use a proper logging service in production)
    console.log(`[${new Date().toISOString()}] ${request.method} ${path}`)

    return NextResponse.next()
}

// Specify which routes this middleware should run for
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}

