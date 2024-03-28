import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { guestPathnames, protectedPathnames } from '~/utils/pathnames'
import { getServerSession } from './utils/session'

export async function middleware(request: NextRequest) {
    const currentPathname = request.nextUrl.pathname
    const { isLoggedIn } = getServerSession(request.cookies)

    const isProtectedPath = protectedPathnames.includes(currentPathname)
    const isGuestPath = guestPathnames.includes(currentPathname)

    if (isProtectedPath && !isLoggedIn) {
        //unauhorized user should be redirect from protected path
        const response = NextResponse.redirect(
            new URL(`/auth/login?redirect_to=${currentPathname}`, request.url)
        )

        //clear access token from cookies if has
        if (response.cookies.has('accessToken')) response.cookies.delete('accessToken')

        return response
    }

    if (isGuestPath && isLoggedIn) {
        //guest path only accesible for unauthorized users
        return NextResponse.redirect(new URL('/', request.url))
    }

    NextResponse.next()
}

export const config = {
    matcher: [
        '/account/:path*',
        '/auth/:path*',
        '/messages/:path*',
        '/notifications/:path*',
        '/suggestions/:path*',
    ],
}
