'use client'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { FormEvent } from 'react'
import { FiLock } from 'react-icons/fi'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'
import AnimatedInput from '~/components/form/AnimatedInput'
import PasswordInput from '~/components/form/PasswordInput'
import Button from '~/components/ui/Button'
import GoogleLoginButton from '~/components/ui/GoogleLoginButton'
import LoadingOverlay from '~/components/ui/LoadingOverlay'
import TextDivider from '~/components/ui/TextDivider'
import { useForm } from '~/hooks/useForm'
import { CredentialPayload } from '~/interfaces/auth.interfaces'
import { useLoginMutation, useLoginWithGoogleMutation } from '~/services/authApi'
import { baseApi } from '~/services/baseApi'
import { setEmail } from '~/slices/authSlice'
import { getErrorData } from '~/utils/error'
import siteMetadata from '~/utils/siteMetadata'

export default function Login() {
   //hooks
   const router = useRouter()
   const dispatch = useDispatch()
   const params = useSearchParams()
   const [login, { isLoading, isSuccess, error }] = useLoginMutation()
   const [loginWithGoogle, { isLoading: isLWGLoading, isSuccess: isLWGSuccess }] =
      useLoginWithGoogleMutation()
   const { formData, handleChange } = useForm<CredentialPayload>()

   const { errors } = getErrorData<CredentialPayload>(error) || {}

   async function handleFormSubmit(e: FormEvent) {
      e.preventDefault()

      try {
         const data = await login(formData).unwrap()

         if (data.user.hasEmailVerified) {
            toast.success('Logged in.')
            dispatch(baseApi.util.resetApiState())
            router.replace(params.get('redirect_to') ? params.get('redirect_to')! : '/')
         } else {
            toast.error('Your email not verified yet.')
            dispatch(setEmail(data.user.email))
            router.push('/auth/email_verification/required')
         }
      } catch (err: any) {
         toast.error(err?.data?.message || 'Request failed.')
      }
   }

   return (
      <>
         <LoadingOverlay isLoading={isLoading || isSuccess || isLWGLoading || isLWGSuccess} />

         <div className="card-auth">
            <div className="flex flex-wrap justify-center mb-2">
               <FiLock size="30" />
            </div>
            <h1 className="heading-auth">Log In to {siteMetadata.appName}</h1>

            <form className="form" method="post" onSubmit={handleFormSubmit}>
               <AnimatedInput
                  label="Username or email"
                  name="username"
                  value={formData.username}
                  error={errors?.username}
                  onChange={handleChange}
               />
               <PasswordInput
                  label="Password"
                  name="password"
                  value={formData.password}
                  error={errors?.password}
                  onChange={handleChange}
               />
               <Button type="submit" radius="md">
                  Log In
               </Button>
            </form>

            <TextDivider className="my-5">OR</TextDivider>

            <GoogleLoginButton loginMutationFn={loginWithGoogle} />

            <small className="block text-center mt-2">
               <Link href="/auth/forgot_password" className="text-blue-500">
                  Forgotten your password?
               </Link>
            </small>
         </div>

         <div className="card-auth text-center mt-2 text-gray-800">
            Don&apos;t have an account? &nbsp;
            <Link href="/auth/signup" className="text-blue-500 font-medium">
               Sign Up
            </Link>
         </div>
      </>
   )
}
