import { CredentialResponse, GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { useLoginWithGoogleMutation } from '~/services/authApi'
import { baseApi } from '~/services/baseApi'

export type LoginStatus = 'idle' | 'loading' | 'success' | 'error'

interface Props {
	onStatusChange: (status: LoginStatus) => void
}

export default function GoogleLoginButton({ onStatusChange }: Props) {
	//hooks
	const dispatch = useDispatch()
	const params = useSearchParams()
	const router = useRouter()
	const [login, { isLoading, isSuccess, isError }] = useLoginWithGoogleMutation()

	useEffect(() => {
		if (isLoading) onStatusChange('loading')
		else if (isSuccess) onStatusChange('success')
		else if (isError) onStatusChange('error')
		else onStatusChange('idle')
	}, [onStatusChange, isLoading, isSuccess, isError])

	async function responseGoogle(response: CredentialResponse) {
		onStatusChange('loading')

		try {
			await login(response.credential!).unwrap()
			onStatusChange('success')
			toast.success('Logged in.')
			dispatch(baseApi.util.resetApiState())
			router.replace(params.get('redirect_to') ? params.get('redirect_to')! : '/')
		} catch (err: any) {
			console.error(err)
			onStatusChange('error')
			toast.error(err?.data?.message || 'Login failed.')
		}
	}

	return (
		<GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
			<div className='flex flex-wrap justify-center my-2'>
				<GoogleLogin
					onSuccess={responseGoogle}
					onError={() => console.error('Google Login Failed')}
					useOneTap={true}
				/>
			</div>
		</GoogleOAuthProvider>
	)
}
