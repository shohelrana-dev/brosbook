"use client"
import { useEffect } from 'react'
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

import mailImage from "@assets/images/mail-with-value.png"
import { useResendVerificationLinkMutation } from "@services/authApi"
import Loading from "@components/global/Loading"
import { useSelector } from "react-redux"
import { selectAuthState } from "@slices/authSlice"
import Button from "@components/global/Button"

export default function RequiredPage(){
    const router                                                            = useRouter()
    const [resendVerificationLink, { isSuccess: isResentEmail, isLoading }] = useResendVerificationLinkMutation()
    const { email }                                                         = useSelector( selectAuthState )

    useEffect( () => {
        if( ! email ){
            router.push( '/auth/login' )
        }
    }, [router, email] )

    async function resendEmail(){
        try {
            await resendVerificationLink( email! ).unwrap()
            toast.success( `Email verification link has sent to ${ email }` )
        } catch ( err ) {
            console.error( err )
        }
    }

    if( ! email ){
        return <Loading/>
    }

    return (
        <>
            <div className="mb-3">
                <h1 className="text-xl md:text-3xl text-center mb-3 font-medium">Email Verification</h1>
                <p className="text-center">
                    Thank you for signing up for a { process.env.NEXT_PUBLIC_APP_NAME } account.
                </p>
            </div>
            <div className="auth-box text-center">
                <Image src={ mailImage } className="text-center m-auto" alt='image'/>
                <h2 className="text-xl md:text-2xl mb-4">Verify your email address</h2>
                <p>Verification email has been sent to:</p>
                <p className="font-bold mb-4">{ email }</p>

                <p className="text-sm text-gray-700 mb-3">Click the link in the email to activate your
                    account.</p>

                <div className="text-sm text-gray-700 mt-8">
                    { isResentEmail ? (
                        <p>Email resent. Please check your inbox.</p>
                    ) : (
                        <div className="flex flex-col items-center">
                            <p>Didn&apos;t receive the link email?</p>
                            <Button onClick={ resendEmail } isLoading={ isLoading } size="sm">Resend email</Button>
                        </div>
                    ) }
                </div>
            </div>

            <div className="auth-box text-center mt-2">
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
