import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const access_token = request.cookies.get('access_token')?.value
    const url = `${process.env["NEXT_PUBLIC_SERVER_API_URL"]}/users/me`

    console.log('---------------middleware trigged================')
    try {
        const res = await fetch(url, {headers: {Authorization: `Bearer ${access_token}`}})
        if(res.ok){
            return NextResponse.next()
        }
    }catch (err:any) {
        console.log(`Middleware error: ${err.message}`)
    }

    return NextResponse.redirect(new URL('/auth/login', request.url))
}

export const config = {
    matcher: ['/']
}