import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import { RequestCookies } from 'next/dist/server/web/spec-extension/cookies'

export default async function isAuthenticated(cookies: RequestCookies | ReadonlyRequestCookies) {
    const accessToken = cookies.get('accessToken')?.value

    return !!accessToken
}
