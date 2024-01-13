import { CredentialResponse, GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { useLoginWithGoogleMutation } from '~/services/authApi'
import { baseApi } from '~/services/baseApi'

interface Props {
	onLoading?: () => void
	onComplete?: () => void
}

export default function GoogleLoginButton({ onLoading, onComplete }: Props) {
	//hooks
	const dispatch = useDispatch()
	const params = useSearchParams()
	const router = useRouter()
	const [login, { isLoading }] = useLoginWithGoogleMutation()

	useEffect(() => {
		if (isLoading && onLoading) onLoading()
	}, [isLoading, onLoading])

	async function responseGoogle(response: CredentialResponse) {
		onLoading && onLoading()

		try {
			await login(response.credential!).unwrap()
			toast.success('Logged in.')
			dispatch(baseApi.util.resetApiState())
			router.replace(params.get('redirect_to') ? params.get('redirect_to')! : '/')
		} catch (err: any) {
			console.error(err)
			toast.error(err?.data?.message || 'Login failed.')
		} finally {
			onComplete && onComplete()
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
