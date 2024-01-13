import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import isAuthenticated from '~/utils/isAuthenticated'
import { guestPathnames, protectedPathnames } from '~/utils/pathnames'

export async function middleware(request: NextRequest) {
	const currentPathname = request.nextUrl.pathname
	const isAuth = await isAuthenticated(request.cookies)

	const isProtectedPath = protectedPathnames.includes(currentPathname)
	const isGuestPath = guestPathnames.includes(currentPathname)

	if (isProtectedPath && !isAuth) {
		//unauhorized user should be redirect from protected path
		const response = NextResponse.redirect(
			new URL(`/auth/login?redirect_to=${currentPathname}`, request.url)
		)

		//clear access token from cookies if has
		if (response.cookies.has('access_token')) response.cookies.delete('access_token')

		return response
	}

	if (isGuestPath && isAuth) {
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
