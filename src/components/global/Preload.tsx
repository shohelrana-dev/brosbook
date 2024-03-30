'use client'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { io } from 'socket.io-client'
import siteMetadata from '~/config/siteMetadata'
import useSession from '~/hooks/useSession'
import useUnauthorizedAlert from '~/hooks/useUnauthorzedAlert'
import { Session } from '~/interfaces/index.interfaces'
import { userLoggedIn, userLoggedOut } from '~/slices/sessionSlice'
import { removeSocket, setSocket } from '~/slices/socketSlice'

export default function Preload({ session }: { session: Session }) {
    const { user, isLoggedIn } = useSession()
    const unauthorizedAlert = useUnauthorizedAlert()
    const pathname = usePathname()
    const dispatch = useDispatch()
    const showedPopup = useRef(false)
    const loadedRef = useRef(false)

    if (session.isLoggedIn && session.user && !loadedRef.current) {
        loadedRef.current = true
        dispatch(userLoggedIn(session.user))
    } else if (!loadedRef.current) {
        loadedRef.current = true
        dispatch(userLoggedOut())
    }

    useEffect(() => {
        if (!user?.id) return

        const socket = io(process.env.NEXT_PUBLIC_SERVER_BASE_URL!)

        socket.on('connect', () => {
            console.log('socket io connected')

            dispatch(setSocket(socket))
            socket.emit('user.connect', user)
        })

        socket.on('disconnect', () => {
            console.log('socket io disconnected')

            dispatch(removeSocket())
        })

        //cleanup socket connection
        return () => {
            socket.close()
            console.log('closed socket connection')
        }
    }, [user, dispatch])

    useEffect(() => {
        if (isLoggedIn || showedPopup.current || pathname?.startsWith('/auth/')) {
            return
        }

        const timerId = setTimeout(() => {
            showedPopup.current = true

            unauthorizedAlert({
                title: `New to ${siteMetadata.appName}?`,
                message: 'Sign up now to get your own personalized timeline!',
            })
        }, 3000)

        //cleanup timer
        return () => clearTimeout(timerId)
    }, [isLoggedIn, pathname, unauthorizedAlert])

    return null
}
