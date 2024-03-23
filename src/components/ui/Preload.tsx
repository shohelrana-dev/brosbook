'use client'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { io } from 'socket.io-client'
import { removeCookie } from 'tiny-cookie'
import useAuth from '~/hooks/useAuth'
import useUnauthorizedAlert from '~/hooks/useUnauthorzedAlert'
import { User } from '~/interfaces/user.interfaces'
import { userLoggedIn, userLoggedOut } from '~/slices/authSlice'
import { addedSocket, removedSocket } from '~/slices/socketSlice'
import isServer from '~/utils/isServer'
import siteMetadata from '~/utils/siteMetadata'

type Props = { user: User }

export default function Preload({ user: preLoadedUser }: Props) {
    const { user, isAuthenticated, isChecked } = useAuth()
    const unauthorizedAlert = useUnauthorizedAlert()
    const pathname = usePathname()
    const dispatch = useDispatch()
    const loadedRef = useRef(false)
    const showedPopup = useRef(false)

    if (!loadedRef.current && preLoadedUser) {
        loadedRef.current = true
        dispatch(userLoggedIn(preLoadedUser))
    } else if (!loadedRef.current) {
        loadedRef.current = true
        dispatch(userLoggedOut())
        if (!isServer) {
            removeCookie('accessToken')
        }
    }

    useEffect(() => {
        if (!user?.id) return

        const socket = io(process.env.NEXT_PUBLIC_SERVER_BASE_URL!)

        socket.on('connect', () => {
            console.log('socket io connected')

            dispatch(addedSocket(socket))
            socket.emit('user.connect', user)
        })

        socket.on('disconnect', () => {
            console.log('socket io disconnected')

            dispatch(removedSocket())
        })

        //cleanup socket connection
        return () => {
            socket.close()
            console.log('Close socket connection')
        }
    }, [user, dispatch])

    useEffect(() => {
        if (!isChecked || isAuthenticated || showedPopup.current || pathname?.startsWith('/auth/')) {
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
    }, [isAuthenticated, pathname, isChecked, unauthorizedAlert])

    return null
}
