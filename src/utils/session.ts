import { getCookie, removeCookie, setCookie } from 'tiny-cookie'
import { User } from '~/interfaces/user.interfaces'
import isServer from './isServer'

export type SetSessionArg = { user: User; accessToken: string }
export type GetSession = { isLoggedIn: boolean; user: User | null }

export function getSession(): GetSession {
    if (isServer) {
        throw new Error('use getServerSession() in server side rendering')
    }

    const isLoggedIn = Boolean(getCookie('isLoggedIn'))
    const user = (JSON.parse(atob(getCookie('userCache')!)) as User) || null

    return { isLoggedIn, user }
}

export function setSession({ user, accessToken }: SetSessionArg) {
    if (isServer) {
        throw new Error('Session could not be set on server side rendering')
    }

    setCookie('accessToken', accessToken)
    setCookie('isLoggedIn', 1)
    setCookie('userCache', btoa(JSON.stringify(user)))
}

export async function clearSession() {
    if (isServer) {
        throw new Error('Session could not be cleared on server side rendering')
    }

    removeCookie('accessToken')
    setCookie('isLoggedIn', 0)
    setCookie('userCache', '')
}