import React, { FormEvent, Fragment, useState } from 'react'
import Head from "next/head"
import { LinearProgress } from "@mui/material"
import Link from "next/link"
import { Lock } from '@mui/icons-material'
import { toast } from "react-toastify"

import AnimatedInput from "@components/common/AnimatedInput"
import PrimaryButton from "@components/common/PrimaryButton"
import { useForgotPasswordMutation } from "@services/authApi"
import { ForgotPasswordErrors } from "@interfaces/auth.interfaces"

function Forgot_password() {
    //hooks
    const [forgotPassword, { isLoading, isSuccess }] = useForgotPasswordMutation()
    const [inputErrors, setInputErrors] = useState<ForgotPasswordErrors>({})
    const [email, setEmail] = useState<string>('')

    //handle form submit
    async function submitForm(event: FormEvent) {
        event.preventDefault()

        try {
            await forgotPassword(email).unwrap()
            toast.success('A reset password link has been sent to your email.')
        } catch (err: any) {
            console.error(err)
            toast.error(err?.data?.message)
            if (err?.data?.errors) setInputErrors(err.data.errors)
        }
    }

    return (
        <Fragment>
            <Head>
                <title>Forgot Password | BrosBook</title>
            </Head>

            <div className="h-screen flex flex-col bg-theme-gray">
                <div className="w-90 mx-auto mt-12 lg:mt-28">
                    {isLoading && <LinearProgress />}

                    <div className="auth-box">
                        <div className="text-center mb-2">
                            <Lock fontSize="large" />
                        </div>
                        {isSuccess ? (
                            <>
                                <h1 className="text-xl text-center mb-4 font-medium">Reset Password</h1>
                                <p className="mb-3">Check your email for a link to reset your password. If it doesn’t appear within a few minutes, check your spam folder.</p>
                                <a className="button-bordered">
                                    <Link href="/auth/login">Return to login</Link>
                                </a>
                            </>
                        ) : (
                            <>
                                <h1 className="text-xl text-center mb-4 font-medium">Trouble with logging in?</h1>
                                <small className="block text-gray-500 text-center mb-2">
                                    Enter your email address and we will send you a link to get back into your account.
                                </small>

                                <form onSubmit={submitForm}>
                                    <AnimatedInput
                                        label="Email"
                                        value={email}
                                        className="mb-3"
                                        error={inputErrors.email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <PrimaryButton fullWidth  type="submit" title="Send Reset Link" isLoading={isLoading} />
                                </form>
                            </>
                        )}

                    </div>

                    <div className="auth-box text-center mt-2">
                        <p className="text-gray-800">
                            Go back?
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

export default Forgot_password
