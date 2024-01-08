"use client"
import toast from "react-hot-toast"
import useAsyncEffect from "use-async-effect"
import {useResendVerificationLinkMutation, useVerifyEmailMutation} from "@/services/authApi"
import Loader from "@/components/global/Loader"
import {ImCheckmark as CheckmarkIcon} from "react-icons/im"
import {ImCross as CrossIcon} from "react-icons/im"
import Link from "next/link"
import {jwtDecode} from 'jwt-js-decode'
import {useEffect, useState} from "react"
import { Button } from "@mui/material"
import { LoadingButton } from "@mui/lab"


type Props = {
    params: { token: string }
}

export default function EmailVerifyPage({params}: Props) {
    const [verifyEmail, {isSuccess, isError}] = useVerifyEmailMutation()
    const [resendVerificationLink, {
        isSuccess: isResentEmail,
        isLoading: resendingLink
    }] = useResendVerificationLinkMutation()
    const [email, setEmail] = useState<string>('')

    useAsyncEffect(async () => {
        const token = params.token

        try {
            await verifyEmail(token).unwrap()
            toast.success('Email verified.')
        } catch (err: any) {
            console.error(err)
            toast.error(err?.data?.message || 'Invalid token!')
        }
    }, [])

    useEffect(() => {
        try {
            const decoded = jwtDecode(params.token)
            setEmail(decoded.payload?.email)
        } catch (e) {
            console.error(e)
        }
    }, [])

    async function resendEmail() {
        try {
            await resendVerificationLink(email).unwrap()
            toast.success(`Email verification link has sent to ${email}`)
        } catch (err) {
            console.error(err)
        }
    }

    const successMarkup = (
        <>
            <div className="flex flex-wrap justify-center flex-col items-center">
                <p className="mb-4 text-green-600">
                    <CheckmarkIcon size={25}/>
                </p>
                <p className="mb-3">
                    Congratulations! You have successfully verified your email address! You can login to
                    the {process.env.NEXT_PUBLIC_APP_NAME} platform.
                </p>
            </div>
            <Link href="/auth/login" className="inline-block mt-3">
                <Button variant="outlined">Return to login</Button>
            </Link>
        </>
    )

    const errorMarkup = (
        <>
            <div className="flex flex-wrap justify-center flex-col items-center p-2 rounded-2xl">
                <p className="mb-4 text-red-600">
                    <CrossIcon size={25}/>
                </p>
                <p className="mb-3">
                    Your email address could not be verified due to unavoidable reasons. The link may expire after more
                    than ten minutes. In that case, request the verification email again by clicking on the button
                    below.
                </p>
            </div>
            <div className="text-sm text-gray-700 mt-6">
                {isResentEmail ? (
                    <p>Email resent. Please check your inbox.</p>
                ) : (
                    <div className="flex flex-wrap flex-col items-center">
                        <p>Didn&apos;t receive the link email?</p>
                        <LoadingButton onClick={resendEmail} loading={resendingLink} disabled={!email}
                                       className="mt-2">
                            Resend email
                        </LoadingButton>
                    </div>
                )}
            </div>
        </>
    )

    if (isSuccess || isError) {
        return (
            <>
                <div className="mb-3">
                    <h1 className="text-xl md:text-3xl text-center mb-3 font-medium">Email Verification</h1>
                    <p className="text-center">
                        Thank you for signing up for a {process.env.NEXT_PUBLIC_APP_NAME} account.
                    </p>
                </div>
                <div className="auth-box">
                    <div className="text-center">
                        {isSuccess ? successMarkup : errorMarkup}
                    </div>
                </div>
            </>
        )
    }

    return <Loader/>
}
