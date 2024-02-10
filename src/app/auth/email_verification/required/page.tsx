'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import mailImage from '~/assets/images/mail-with-value.png'
import Button from '~/components/ui/Button'
import Loader from '~/components/ui/Loader'
import { useResendVerificationLinkMutation } from '~/services/authApi'
import { useAuthState } from '~/slices/authSlice'
import siteMetadata from '~/utils/siteMetadata'

export default function RequiredPage() {
   const router = useRouter()
   const [resendVerificationLink, { isSuccess: isResentEmail, isLoading }] =
      useResendVerificationLinkMutation()
   const { email } = useAuthState()

   if (!email) router.push('/auth/login')

   async function handleResendEmail() {
      try {
         await resendVerificationLink(email!).unwrap()
         toast.success(`Email verification link has sent to ${email}`)
      } catch (err) {
         console.error(err)
      }
   }

   if (!email) {
      return <Loader />
   }

   return (
      <>
         <div className="mb-3">
            <h1 className="text-xl md:text-3xl text-center mb-3 font-medium">Email Verification</h1>
            <p className="text-center">
               Thank you for signing up for a {siteMetadata.appName} account.
            </p>
         </div>
         <div className="card-auth text-center">
            <Image src={mailImage} className="text-center m-auto" alt="image" />
            <h2 className="text-xl md:text-2xl mb-4">Verify your email address</h2>
            <p>Verification email has been sent to:</p>
            <p className="font-bold mb-4">{email}</p>

            <p className="text-sm text-gray-700 mb-3">
               Click the link in the email to activate your account.
            </p>

            <div className="text-sm text-gray-700 mt-8">
               {isResentEmail ? (
                  <p>Email resent. Please check your inbox.</p>
               ) : (
                  <div className="flex flex-wrap flex-col items-center">
                     <p>Didn&apos;t receive the link email?</p>
                     <Button onClick={handleResendEmail} isLoading={isLoading} className="mt-2">
                        Resend email
                     </Button>
                  </div>
               )}
            </div>
         </div>

         <div className="card-auth text-center mt-2">
            <p className="text-gray-800">
               Go Back?
               <Link href="/auth/login" className="ml-1 text-blue-500 font-medium">
                  Log In
               </Link>
            </p>
         </div>
      </>
   )
}
