import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '~/lib/session'

const protectedRoutes = [
    '/messages',
    '/notifications',
    '/suggestions',
    '/account',
    '/account/profile',
    '/auth/logout',
]
const guestRoutes = ['/auth/login', '/auth/signup', '/auth/email_verification']

export default function authMiddleware(req: NextRequest) {
    const currentRoute = req.nextUrl.pathname
    const { isLoggedIn } = getServerSession(req.cookies)

    const isProtectedRoute = protectedRoutes.includes(currentRoute)
    const isGuestRoute = guestRoutes.includes(currentRoute)

    const shouldRedirectToLogin = isProtectedRoute && !isLoggedIn
    const shouldRedirectToHome = isGuestRoute && isLoggedIn

    if (shouldRedirectToLogin) {
        return NextResponse.redirect(new URL(`/auth/login?redirect_to=${currentRoute}`, req.url))
    }

    if (shouldRedirectToHome) {
        return NextResponse.redirect(new URL(`/`, req.url))
    }
}
