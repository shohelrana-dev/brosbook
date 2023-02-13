"use client"
import { useState } from 'react'
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import useAsyncEffect from "use-async-effect"
import toast from "react-hot-toast"

import mailImage from "@images/mail-with-value.png"
import { useResendVerificationLinkMutation } from "@services/authApi"
import Button from "@components/global/Button"
import Loading from "@components/global/Loading"

export default function RequiredPage(){
    const router                            = useRouter()
    const [resendVerificationLink]          = useResendVerificationLinkMutation()
    const [email, setEmail]                 = useState<string>( "" )
    const [isResendEmail, setIsResendEmail] = useState<boolean>( false )

    useAsyncEffect( async() => {
        const email = localStorage.getItem( 'email' )
        if( ! email ){
            router.push( '/auth/login' )
        }
        setEmail( email! )
        localStorage.removeItem( 'email' )
    }, [router] )

    async function resendEmail(){
        try {
            await resendVerificationLink( email ).unwrap()
            toast.success( 'Email verification link has sent to your email.' )
            setIsResendEmail( true )
        } catch ( err ) {
            console.error( err )
        }
    }

    if( ! email ){
        return <Loading/>
    }

    return (
        <div className="h-screen flex flex-col bg-theme-gray">
            <div className="w-90 mx-auto mt-12 lg:mt-28">
                <div className="mb-3">
                    <h1 className="text-xl md:text-3xl text-center mb-3 font-medium">Email Verification</h1>
                    <p className="text-center">Thank you for signing up for a Brosbook account.</p>
                </div>
                <div className="auth-box text-center">
                    <Image src={ mailImage } className="text-center m-auto" alt='image'/>
                    <h2 className="text-xl md:text-2xl mb-4">Verify your email address</h2>
                    <p>Verification email has been sent to:</p>
                    <p className="font-bold mb-4">{ email }</p>

                    <p className="text-sm text-gray-500 mb-3">Click the link in the email to activate your
                        account.</p>

                    <p className="text-sm text-gray-500 mt-8">
                        { ! isResendEmail ? (
                            <span>Didn&apos;t receive the link email?&nbsp;
                                <Button onClick={ resendEmail }>Resend email</Button>
                            </span> ) : (
                            <span>Email resent. Please check your inbox.</span>
                        ) }
                    </p>
                </div>

                <div className="auth-box text-center mt-2">
                    <p className="text-gray-800">
                        Go Back?
                        <Link href="/auth/login" className="ml-1 text-blue-500 font-medium">
                            Log In
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    )
}
