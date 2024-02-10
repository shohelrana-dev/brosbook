'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent } from 'react'
import PasswordStrengthBar from 'react-password-strength-bar'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'
import AnimatedInput from '~/components/form/AnimatedInput'
import PasswordInput from '~/components/form/PasswordInput'
import Button from '~/components/ui/Button'
import GoogleLoginButton from '~/components/ui/GoogleLoginButton'
import LoadingOverlay from '~/components/ui/LoadingOverlay'
import TextDivider from '~/components/ui/TextDivider'
import { useForm } from '~/hooks/useForm'
import { SignupPayload } from '~/interfaces/auth.interfaces'
import { useLoginWithGoogleMutation, useSignupMutation } from '~/services/authApi'
import { setEmail } from '~/slices/authSlice'
import { getErrorData } from '~/utils/error'

export default function Signup() {
   //hooks
   const dispatch = useDispatch()
   const router = useRouter()
   const [signup, { isLoading, isSuccess, error }] = useSignupMutation()
   const { formData, handleChange } = useForm<SignupPayload>()
   const [loginWithGoogle, { isLoading: isLWGLoading, isSuccess: isLWGSuccess }] =
      useLoginWithGoogleMutation()

   const { errors } = getErrorData<SignupPayload>(error) || {}

   async function handleFormSubmit(e: FormEvent) {
      e.preventDefault()

      try {
         await signup(formData).unwrap()

         toast.success('Signup success. You have received a mail to verify the account.')
         dispatch(setEmail(formData.email))
         router.push('/auth/email_verification/required')
      } catch (err: any) {
         toast.error(err?.data?.message || 'Request failed.')
      }
   }

   return (
      <>
         <LoadingOverlay isLoading={isLoading || isSuccess || isLWGLoading || isLWGSuccess} />

         <div className="card-auth">
            <h1 className="heading-auth">Sign Up</h1>

            <GoogleLoginButton loginMutationFn={loginWithGoogle} />

            <TextDivider className="my-5">OR</TextDivider>

            <form className="form" method="post" onSubmit={handleFormSubmit}>
               <AnimatedInput
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  error={errors?.firstName}
                  onChange={handleChange}
               />
               <AnimatedInput
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  error={errors?.lastName}
                  onChange={handleChange}
               />
               <AnimatedInput
                  label="Email"
                  name="email"
                  value={formData.email}
                  error={errors?.email}
                  onChange={handleChange}
               />
               <AnimatedInput
                  label="Username"
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
               {formData.password ? <PasswordStrengthBar password={formData.password} /> : null}

               <Button type="submit" radius="md">
                  Sign Up
               </Button>
            </form>

            <p className="text-center text-gray-600 text-xs mt-3">
               By signing up, you agree to our Terms, Data Policy and Cookie Policy.
            </p>
         </div>

         <div className="card-auth text-center mt-2 text-gray-800">
            Have an account? &nbsp;
            <Link href="/auth/login" className="text-blue-500 font-medium">
               Log In
            </Link>
         </div>
      </>
   )
}
