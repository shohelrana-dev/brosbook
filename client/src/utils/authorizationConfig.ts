import {ReadonlyRequestCookies} from "next/dist/server/app-render"

export default function authorizationConfig(cookies: ReadonlyRequestCookies) {
    return {
        headers: { Authorization: `Bearer ${cookies.get('access_token')?.value}` }
    }
}