import { RequestCookies } from "next/dist/server/web/spec-extension/cookies"
import { getCurrentUser } from "@services/index"
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies"

export default async function isAuthenticated( cookies: RequestCookies | ReadonlyRequestCookies ) {
    const access_token = cookies.get( 'access_token' )?.value
    if ( !access_token ) return false

    const user = await getCurrentUser( cookies )

    return !!user?.id
}