import { jwtDecode } from 'jwt-js-decode';
import { RequestCookies } from "next/dist/server/web/spec-extension/cookies"
import { ReadonlyRequestCookies } from "next/dist/server/app-render"

export default function isAuthenticated(cookies: RequestCookies | ReadonlyRequestCookies) {
    const access_token = cookies.get('access_token')?.value
    if (!access_token) return false

    try {
        jwtDecode(access_token)

        return true
    } catch (e) {
        console.log(e)
        return false
    }
}