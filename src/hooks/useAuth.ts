import { usePathname } from 'next/navigation'
import { useAuthState } from '~/slices/authSlice'

type UseAuthOptions = {
	require?: boolean
	onUnautenticated?: () => void
	onAutenticated?: () => void
}

export default function useAuth(options?: UseAuthOptions) {
	const authState = useAuthState()
	const pathname = usePathname()

	const { onUnautenticated, onAutenticated, require } = options || {}
	const { isAuthenticated, isChecked } = authState

	if (isChecked) {
		if (onUnautenticated && !isAuthenticated) {
			onUnautenticated()
		}

		if (onAutenticated && isAuthenticated) {
			onAutenticated()
		}

		if (require && !isAuthenticated) {
			window.location.href = `/auth/login?redirect_to=${pathname}`
		}
	}

	return authState
}
