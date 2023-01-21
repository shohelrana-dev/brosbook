import { RequestCookies } from "next/dist/server/web/spec-extension/cookies"
import { ReadonlyRequestCookies } from "next/dist/server/app-render"

export default async function isAuthenticated( cookies: RequestCookies | ReadonlyRequestCookies ){
    const access_token = cookies.get( 'access_token' )?.value
    const url          = `${ process.env.NEXT_PUBLIC_SERVER_API_URL }/users/me`

    const res = await fetch( url, { headers: { Authorization: `Bearer ${ access_token }` } } )

    return res.ok
}