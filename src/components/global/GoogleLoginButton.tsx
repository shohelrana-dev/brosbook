import { CredentialResponse, GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { useLoginWithGoogleMutation } from '~/services/authApi'
import { baseApi } from '~/services/baseApi'

interface Props {
	setIsLoading: (isLoading: boolean) => void
}

function GoogleLoginButton({ setIsLoading }: Props) {
	//hooks
	const router = useRouter()
	const dispatch = useDispatch()
	const params = useSearchParams()
	const [login, { isLoading, isSuccess }] = useLoginWithGoogleMutation()

	async function responseGoogle(response: CredentialResponse) {
		try {
			await login(response.credential!).unwrap()
			dispatch(baseApi.util.resetApiState())
			router.push(params.get('redirect_to') ? params.get('redirect_to')! : '/')
			toast.success('Logged in.')
		} catch (err: any) {
			console.error(err)
			toast.error(err?.data?.message || 'Login failed.')
		}
	}

	useEffect(() => {
		if (isLoading) {
			setIsLoading(true)
		} else if (isSuccess) {
			setIsLoading(true)
		} else {
			setIsLoading(false)
		}
	}, [isSuccess, isLoading])

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

export default GoogleLoginButton
