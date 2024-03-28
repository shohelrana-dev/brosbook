import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useSessionState } from '~/slices/sessionSlice'

type useSessionOptions = {
    require?: boolean
    onLogout?: () => void
    onLogin?: () => void
}

export default function useSession(options?: useSessionOptions) {
    const sessionState = useSessionState()
    const pathname = usePathname()

    const { onLogout, onLogin, require } = options || {}
    const { isLoggedIn, isChecked } = sessionState

    useEffect(() => {
        if (isChecked) {
            if (onLogout && !isLoggedIn) {
                onLogout()
            }

            if (onLogin && isLoggedIn) {
                onLogin()
            }

            if (require && !isLoggedIn) {
                window.location.href = `/auth/login?redirect_to=${pathname}`
            }
        }
    }, [isChecked, isLoggedIn, require, onLogin, onLogout, pathname])

    return sessionState
}
