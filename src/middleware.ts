import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import isAuthenticated from '@/utils/isAuthenticated'

const protectedPaths = [
	'/messages',
	'/notifications',
	'/suggestions',
	'/account',
	'/account/profile',
	'/auth/logout',
]
const guestPaths = ['/auth/login', '/auth/signup', '/auth/email_verification']

export async function middleware(request: NextRequest) {
	const currentPathname = request.nextUrl.pathname
	const isUserAuthorized = await isAuthenticated(request.cookies)

	const isProtectedPath = Boolean(
		protectedPaths.find(path => path !== '/' && currentPathname.startsWith(path))?.length
	)
	const isGuestPath = Boolean(guestPaths.find(path => currentPathname.startsWith(path))?.length)

	const shouldRedirect = (isProtectedPath && !isUserAuthorized) || (isGuestPath && isUserAuthorized)

	// Conditionally delete access_token cookie for clarity
	if (!isUserAuthorized && request.cookies.has('access_token')) {
		request.cookies.delete('access_token')
	}

	if (shouldRedirect) {
		if (isProtectedPath && !isUserAuthorized) {
			return NextResponse.redirect(
				new URL(`/auth/login?redirect_to=${currentPathname}`, request.url)
			)
		}

		//authorized but guest path
		return NextResponse.redirect(new URL('/', request.url))
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
		{
			source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
			missing: [
				{ type: 'header', key: 'next-router-prefetch' },
				{ type: 'header', key: 'purpose', value: 'prefetch' },
			],
		},
	],
}
