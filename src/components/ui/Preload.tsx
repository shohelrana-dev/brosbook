'use client'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { io } from 'socket.io-client'
import useAuth from '~/hooks/useAuth'
import useUnauthorizedAlert from '~/hooks/useUnauthorzedAlert'
import { addedSocket, removedSocket } from '~/slices/socketSlice'
import siteMetadata from '~/utils/siteMetadata'

export default function Preload() {
    const { user, isAuthenticated } = useAuth()
    const unauthorizedAlert = useUnauthorizedAlert()
    const pathname = usePathname()
    const dispatch = useDispatch()
    const showedPopup = useRef(false)

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
        if (isAuthenticated || showedPopup.current || pathname?.startsWith('/auth/')) {
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
    }, [isAuthenticated, pathname, unauthorizedAlert])

    return null
}
