import { cookies } from 'next/headers'
import { User } from '~/interfaces/user.interfaces'
import isServer from './isServer'
import { GetSession } from './session'

export function getServerSession(): GetSession {
    if (isServer) {
        try {
            const nextCookies = cookies()
            const isLoggedIn = Boolean(nextCookies.get('isLoggedIn')?.value)
            const user = JSON.parse(atob(nextCookies.get('userCache')?.value!)) as User

            return { isLoggedIn, user }
        } catch (err) {
            console.error(err)
            return { isLoggedIn: false, user: null }
        }
    } else {
        throw new Error('Session could not be fetched on client side rendering')
    }
}
