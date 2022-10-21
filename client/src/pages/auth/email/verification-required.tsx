import React, { Fragment, useState } from 'react'
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { useSelector } from "react-redux"
import { useRouter } from "next/router"
import { LinearProgress } from "@mui/material"
import useAsyncEffect from "use-async-effect"
import { toast } from "react-toastify"

import { selectAuthState } from "@features/authSlice"
import mailImage from "@images/mail-with-value.png"
import { useResendVerificationLinkMutation } from "@services/authApi"

function VerificationRequired() {
    const router = useRouter()
    const [resendVerificationLink] = useResendVerificationLinkMutation()
    const { user } = useSelector(selectAuthState)
    const [isResendEmail, setIsResendEmail] = useState<boolean>(false)
    const [isCheckedUser, setIsCheckedUser] = useState<boolean>(false)

    useAsyncEffect(async () => {
        if (Object.keys(user).length < 1) {
            await router.push('/auth/login')
        }
        setIsCheckedUser(true)
    }, [router])

    async function resendEmail() {
        try {
            await resendVerificationLink(user.email).unwrap()
            toast.success('Email verification link has sent to your email.')
            setIsResendEmail(true)
        } catch (err) {
            console.error(err)
        }
    }

    if (!isCheckedUser) {
        return <LinearProgress />
    }

    return (
        <Fragment>
            <Head>
                <title>Email verification | BrosBook</title>
            </Head>

            <div className="h-screen flex flex-col bg-theme-gray">
                <div className="w-90 mx-auto mt-12 lg:mt-28">
                    <div className="mb-3">
                        <h1 className="text-xl md:text-3xl text-center mb-3 font-medium">Email Verification</h1>
                        <p className="text-center">Thank you for signing up for a Brosbook account.</p>
                    </div>
                    <div className="auth-box text-center">
                        <Image src={mailImage} className="text-center" alt='image' />
                        <h2 className="text-xl md:text-2xl mb-4">Verify your email address</h2>
                        <p>Verification email has been sent to:</p>
                        <p className="font-bold mb-4">{user.email}</p>

                        <p className="text-sm text-gray-500 mb-3">Click the link in the email to activate your
                            account.</p>

                        <p className="text-sm text-gray-500 mt-8">
                            {!isResendEmail ? (
                                <span>
                                    Didn&apos;t receive the link email?&nbsp;
                                    <button onClick={resendEmail}
                                        className="font-bold text-green-700">Resend email</button>
                                </span>) : (
                                <span>Email resent. Please check your inbox.</span>
                            )}
                        </p>
                    </div>

                    <div className="auth-box text-center mt-2">
                        <p className="text-gray-800">
                            Go Back?
                            <Link href="/auth/login">
                                <a className="ml-1 text-blue-500 font-medium">
                                    Log In
                                </a>
                            </Link>
                        </p>
                    </div>

                </div>
            </div>
        </Fragment>
    )
}

export default VerificationRequired