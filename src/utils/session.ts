import { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import { getCookie, removeCookie, setCookie } from 'tiny-cookie'
import { Session, SessionArg } from '~/interfaces/index.interfaces'

const emptySession: Session = { isLoggedIn: false, user: null, accessToken: null }

export function getServerSession(cookies: ReadonlyRequestCookies | RequestCookies): Session {
    try {
        const isLoggedIn = cookies.get('isLoggedIn')?.value === '1'
        const accessToken = cookies.get('accessToken')?.value!
        const userCacheCookie = cookies.get('userCache')?.value
        const user = userCacheCookie ? JSON.parse(atob(userCacheCookie)) : null

        return { isLoggedIn, user, accessToken }
    } catch (err) {
        console.error('Error parsing cookie: ', err)
        return emptySession
    }
}

export function getSession(): Session {
    try {
        const isLoggedIn = getCookie('isLoggedIn') === '1'
        const accessToken = getCookie('accessToken')
        const userCacheCookie = getCookie('userCache')
        const user = userCacheCookie ? JSON.parse(atob(userCacheCookie)) : null

        return { isLoggedIn, user, accessToken }
    } catch (err) {
        console.error('Error parsing cookie: ', err)
        return emptySession
    }
}

export function setSession({ user, accessToken }: SessionArg) {
    if (!user || !accessToken) {
        throw new Error('User or access token not provided')
    }

    setCookie('accessToken', accessToken)
    setCookie('isLoggedIn', '1')
    setCookie('userCache', btoa(JSON.stringify(user)))
}

export function updateSession({ user, accessToken }: Partial<SessionArg>) {
    if (accessToken) setCookie('accessToken', accessToken)
    if (user) setCookie('userCache', btoa(JSON.stringify(user)))
}

export async function clearSession() {
    removeCookie('accessToken')
    setCookie('isLoggedIn', '0')
    setCookie('userCache', '')
}
