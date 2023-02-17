"use client"
import toast from "react-hot-toast"
import useAsyncEffect from "use-async-effect"
import { useResendVerificationLinkMutation, useVerifyEmailMutation } from "@services/authApi"
import Loading from "@components/global/Loading"
import { ImCheckmark as CheckmarkIcon } from "react-icons/im"
import { ImCross as CrossIcon } from "react-icons/im"
import Link from "next/link"
import ButtonOutline from "@components/global/ButtonOutline"
import ButtonGray from "@components/global/ButtonGray"

type Props = {
    params: { token: string }
}

export default function EmailVerifyPage( { params }: Props ){
    const [verifyEmail, { isSuccess, isError }] = useVerifyEmailMutation()
    const [resendVerificationLink, {
        isSuccess: isResendEmail,
        isLoading: resendEmailLoading
    }]                                          = useResendVerificationLinkMutation()

    const email = localStorage?.getItem( 'email' ) || ''

    useAsyncEffect( async() => {
        const token = params.token

        try {
            await verifyEmail( token ).unwrap()
            toast.success( 'Email verified.' )
            localStorage.removeItem( 'email' )
        } catch ( err: any ) {
            console.error( err )
            toast.error( err?.data?.message || 'Email verification failed.' )
        }
    }, [] )

    async function resendEmail(){
        try {
            await resendVerificationLink( email ).unwrap()
            toast.success( 'Email verification link has sent to your email.' )
        } catch ( err ) {
            console.error( err )
        }
    }

    const successMarkup = (
        <>
            <div className="flex justify-center flex-col items-center">
                <p className="mb-2 text-green-600">
                    <CheckmarkIcon size={ 25 }/>
                </p>
                <p className="mb-3">
                    Congratulations! You have successfully verified your email address! You can login to
                    the { process.env.NEXT_PUBLIC_APP_NAME } platform.
                </p>
            </div>
            <Link href="/auth/login" className="inline-block mt-3">
                <ButtonOutline size="sm">Return to login</ButtonOutline>
            </Link>
        </>
    )

    const errorMarkup = (
        <>
            <div className="flex justify-center flex-col items-center p-2 rounded-2xl">
                <p className="mb-2 text-red-600">
                    <CrossIcon size={ 25 }/>
                </p>
                <p className="mb-3">
                    Your email address could not be verified due to unavoidable reasons. The link may expire after more
                    than ten minutes. In that case, request the verification email again by clicking on the button
                    below.
                </p>
            </div>
            <p className="text-sm text-gray-500 mt-8">
                { isResendEmail ? (
                    <span>Email resent. Please check your inbox.</span>
                ) : (
                    <ButtonGray onClick={ resendEmail }
                                isLoading={ resendEmailLoading } disabled={ ! email }>
                        Resend email
                    </ButtonGray>
                ) }
            </p>
        </>
    )

    if( isSuccess || isError ){
        return (
            <div className="h-screen flex flex-col bg-theme-gray">
                <div className="w-90 mx-auto mt-12 lg:mt-28">
                    <div className="auth-box">
                        <div className="text-center">
                            <h1 className="text-xl text-center mb-4 font-medium">Email verification</h1>
                            { isSuccess ? successMarkup : errorMarkup }
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return <Loading/>
}
