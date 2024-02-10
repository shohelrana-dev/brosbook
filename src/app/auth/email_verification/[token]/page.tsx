'use client'
import { jwtDecode } from 'jwt-js-decode'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ImCheckmark as CheckmarkIcon, ImCross as CrossIcon } from 'react-icons/im'
import { toast } from 'sonner'
import Button from '~/components/ui/Button'
import Loader from '~/components/ui/Loader'
import { useResendVerificationLinkMutation, useVerifyEmailMutation } from '~/services/authApi'
import siteMetadata from '~/utils/siteMetadata'

type Props = {
   params: { token: string }
}

export default function EmailVerifyPage({ params }: Props) {
   const [verifyEmail, { isSuccess, isError }] = useVerifyEmailMutation()
   const [resendVerificationLink, { isSuccess: isResentEmail, isLoading: resendingLink }] =
      useResendVerificationLinkMutation()
   const [email, setEmail] = useState<string>('')

   const { token } = params

   useEffect(() => {
      if (!token) return
      let ignore = false

      async function runVerifyEmail() {
         try {
            await verifyEmail(token).unwrap()
            if (!ignore) toast.success('Email verified.')
         } catch (err: any) {
            if (!ignore) toast.error(err?.data?.message || 'Invalid token!')
         }
      }

      runVerifyEmail()

      return () => {
         ignore = true
      }
   }, [token, verifyEmail])

   useEffect(() => {
      if (!token) return
      try {
         const decoded = jwtDecode(token)
         setEmail(decoded.payload?.email)
      } catch (e) {
         console.error(e)
      }
   }, [token])

   async function handleResendEmail() {
      try {
         await resendVerificationLink(email).unwrap()
         toast.success(`Email verification link has sent to ${email}`)
      } catch (err: any) {
         toast.error(err?.data?.message || 'Request failed.')
      }
   }

   const successMarkup = (
      <>
         <div className="flex flex-wrap justify-center flex-col items-center">
            <p className="mb-4 text-green-600">
               <CheckmarkIcon size={25} />
            </p>
            <p className="mb-3">
               Congratulations! You have successfully verified your email address! You can login to
               the {siteMetadata.appName} platform.
            </p>
         </div>
         <Button as={Link} href="/auth/login" variant="bordered" className="mt-3">
            Return to login
         </Button>
      </>
   )

   const errorMarkup = (
      <>
         <div className="flex flex-wrap justify-center flex-col items-center p-2 rounded-2xl">
            <p className="mb-4 text-red-600">
               <CrossIcon size={25} />
            </p>
            <p className="mb-3">
               Your email address could not be verified due to unavoidable reasons. The link may
               expire after more than ten minutes. In that case, request the verification email
               again by clicking on the button below.
            </p>
         </div>
         <div className="text-sm text-gray-700 mt-6">
            {isResentEmail ? (
               <p>Email resent. Please check your inbox.</p>
            ) : (
               <div className="flex flex-wrap flex-col items-center">
                  <p>Didn&apos;t receive the link email?</p>
                  <Button
                     onClick={handleResendEmail}
                     isLoading={resendingLink}
                     isDisabled={!email}
                     className="mt-2"
                  >
                     Resend email
                  </Button>
               </div>
            )}
         </div>
      </>
   )

   if (isSuccess || isError) {
      return (
         <>
            <div className="mb-3">
               <h1 className="text-xl md:text-3xl text-center mb-3 font-medium">
                  Email Verification
               </h1>
               <p className="text-center">
                  Thank you for signing up for a {siteMetadata.appName} account.
               </p>
            </div>
            <div className="card-auth">
               <div className="text-center">{isSuccess ? successMarkup : errorMarkup}</div>
            </div>
         </>
      )
   }

   return <Loader />
}
