import {ReadonlyRequestCookies} from "next/dist/server/app-render"
import {RequestCookies} from "next/dist/server/web/spec-extension/cookies"

export default function authorizationConfig(cookies: RequestCookies | ReadonlyRequestCookies) {
    return {
        headers: { Authorization: `Bearer ${cookies.get('access_token')?.value}` }
    }
}