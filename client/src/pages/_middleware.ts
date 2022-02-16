import type { NextFetchEvent, NextRequest } from 'next/server'

export async function middleware( req: NextRequest, ev: NextFetchEvent ) {
    const access_token = req.cookies.access_token

    const response = await fetch( `${ process.env.NEXT_PUBLIC_SERVER_API_URL }/auth/me`, {
        headers: { "Authorization": "Bearer " + access_token }
    } )
    const data     = await response.json()

    //console.log( data )
}