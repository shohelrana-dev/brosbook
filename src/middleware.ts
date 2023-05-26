import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import isAuthenticated from "@utils/isAuthenticated"

export async function middleware( request: NextRequest ) {
    /*const currentPathname  = request.nextUrl.pathname
    const isUserAuthorized = await isAuthenticated( request.cookies )
    const protectedPaths   = ['/messages', '/notifications', '/suggestions', '/account', '/account/profile', '/auth/logout']
    const guestPaths       = ['/auth/login', '/auth/signup', '/auth/email_verification']

    const isProtectedPath = Boolean( protectedPaths.find( path => currentPathname.startsWith( path ) )?.length )
    const isGuestPath     = Boolean( guestPaths.find( path => currentPathname.startsWith( path ) )?.length )
    const isHomePath      = currentPathname === '/'


    if ( !isGuestPath && !isProtectedPath && isHomePath ) {
        return NextResponse.next()
    }

    if ( isUserAuthorized ) {
        if ( isGuestPath ) {
            return NextResponse.redirect( new URL( '/', request.url ) )
        }
    } else {
        if ( isProtectedPath && request.cookies.has( 'access_token' ) ) {
            const response = NextResponse.redirect( new URL( `/auth/login?redirect_to=${ currentPathname }`, request.url ) )
            response.cookies.delete( 'access_token' )
        } else if ( isProtectedPath ) {
            return NextResponse.redirect( new URL( `/auth/login?redirect_to=${ currentPathname }`, request.url ) )
        }
    }*/

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
