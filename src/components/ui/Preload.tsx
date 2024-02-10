'use client'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
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

let isLoaded = false
let isShowedPopup = false

export default function Preload({ user: preLoadedUser }: { user: User }) {
	const { user, isAuthenticated, isChecked } = useAuth()
	const unauthorizedAlert = useUnauthorizedAlert()
	const pathname = usePathname()
	const dispatch = useDispatch()

	if (!isLoaded && preLoadedUser) {
		isLoaded = true
		dispatch(userLoggedIn(preLoadedUser))
	} else if (!isLoaded) {
		isLoaded = true
		if (!isServer) removeCookie('access_token')
		dispatch(userLoggedOut())
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
		if (!isChecked || isAuthenticated || isShowedPopup || pathname?.startsWith('/auth/')) {
			return
		}

		const timerId = setTimeout(() => {
			isShowedPopup = true

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
