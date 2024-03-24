import { CredentialResponse, GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'
import { TypedMutationTrigger } from '@reduxjs/toolkit/query/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { LoginResponse } from '~/interfaces/auth.interfaces'

interface Props {
    loginMutationFn: TypedMutationTrigger<LoginResponse, string, any>
}

export default function GoogleLoginButton({ loginMutationFn }: Props) {
    //hooks
    const searchParams = useSearchParams()
    const router = useRouter()

    async function handleLogin(response: CredentialResponse) {
        await loginMutationFn(response.credential!).unwrap()
        router.replace(searchParams.get('redirect_to') || '/')
    }

    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
            <div className='flex flex-wrap justify-center my-2'>
                <GoogleLogin
                    onSuccess={handleLogin}
                    onError={() => console.error('Google Login Failed')}
                    useOneTap={true}
                />
            </div>
        </GoogleOAuthProvider>
    )
}
