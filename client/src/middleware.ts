import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import isAuthenticated from "@utils/isAuthenticated"

export async function middleware(request: NextRequest) {
    if(await isAuthenticated(request)){
        if(request.nextUrl.pathname.startsWith('/auth') && ((request.nextUrl.pathname !== '/auth/logout') && (request.nextUrl.pathname !== '/auth/forgot_password'))){
            return NextResponse.redirect(new URL('/', request.url))
        }
        return NextResponse.next()
    }else {
        if(request.nextUrl.pathname.startsWith('/account') || request.nextUrl.pathname === '/'){
            return NextResponse.redirect(new URL('/auth/login', request.url))
        }
        return NextResponse.next()
    }
}
