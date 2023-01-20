import { http } from "@boot/axios"
import { RequestCookies } from "next/dist/server/web/spec-extension/cookies"
import { ReadonlyRequestCookies } from "next/dist/server/app-render"
import getAuthorizationConfig from "@utils/getAuthorizationConfig"

export async function getCurrentUser( cookies: RequestCookies | ReadonlyRequestCookies ){
    try {
        const config = getAuthorizationConfig( cookies )
        const res    = await http.get( `/users/me`, config )

        return res.data
    } catch ( e ) {
        return null
    }
}