import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectAuthState } from '~/slices/authSlice'

type UseAuthOptions = {
	require?: boolean
	onUnautenticated?: () => void
	onAutenticated?: () => void
}

export default function useAuth(options?: UseAuthOptions) {
	const authState = useSelector(selectAuthState)
	const pathname = usePathname()

	const { onUnautenticated, onAutenticated, require } = options || {}
	const { isAuthenticated, isChecked } = authState

	useEffect(() => {
		if (typeof onUnautenticated === 'function' && isChecked && !isAuthenticated) {
			onUnautenticated()
		}

		if (typeof onAutenticated === 'function' && isChecked && isAuthenticated) {
			onAutenticated()
		}

		if (require && isChecked && !isAuthenticated) {
			window.location.href = `/auth/login?redirect_to=${pathname}`
		}
	}, [isAuthenticated, isChecked, onUnautenticated, onAutenticated, require, pathname])

	return authState
}
