import { CredentialResponse, GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'
import { MutationTrigger } from '@reduxjs/toolkit/dist/query/react/buildHooks'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'
import { baseApi } from '~/services/baseApi'

interface Props {
   loginMutationFn: MutationTrigger<any>
}

export default function GoogleLoginButton({ loginMutationFn }: Props) {
   //hooks
   const dispatch = useDispatch()
   const searchParams = useSearchParams()
   const router = useRouter()

   async function handleLogin(response: CredentialResponse) {
      try {
         await loginMutationFn(response.credential!).unwrap()
         toast.success('Logged in.')
         dispatch(baseApi.util.resetApiState())
         router.replace(searchParams.get('redirect_to') ? searchParams.get('redirect_to')! : '/')
      } catch (err: any) {
         toast.error(err?.data?.message || 'Login failed.')
      }
   }

   return (
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
         <div className="flex flex-wrap justify-center my-2">
            <GoogleLogin
               onSuccess={handleLogin}
               onError={() => console.error('Google Login Failed')}
               useOneTap={true}
            />
         </div>
      </GoogleOAuthProvider>
   )
}
