import { NextRequest, NextResponse } from 'next/server'
import authMiddleware from './lib/authMiddleware'

const middlewares = [authMiddleware]

export function middleware(request: NextRequest) {
    for (const fn of middlewares) {
        const response = fn(request)
        if (response) return response
    }

    return NextResponse.next()
}

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
