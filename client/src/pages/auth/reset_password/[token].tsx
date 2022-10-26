import React, { FormEvent, Fragment, useState } from 'react'
import { useRouter } from "next/router"
import Link from "next/link"
import Head from "next/head"
import { LinearProgress } from "@mui/material"
import { Lock } from "@mui/icons-material"
import { toast } from "react-toastify"

import PrimaryButton from "@components/common/PrimaryButton"
import { useResetPasswordMutation } from "@services/authApi"
import PasswordInput from "@components/common/PasswordInput"
import {ResetPassPayload} from "@interfaces/auth.interfaces"

function ResetPassword() {
    //hooks
    const router = useRouter()
    const [resetPassword, { isLoading, isSuccess }] = useResetPasswordMutation()

    const [inputErrors, setInputErrors] = useState<ResetPassPayload>({})
    const [password, setPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')

    //handle form submit
    async function submitForm(event: FormEvent) {
        event.preventDefault()

        const token = router.query.token as string

        try {
            await resetPassword({ password, confirmPassword, token}).unwrap()
            toast.success('Your login password has been changed.')
            await router.push('/auth/login')
        } catch (err: any) {
            console.error(err)
            if (err?.data?.errors) setInputErrors(err.data.errors)
            toast.error(err?.data?.message)
        }
    }

    return (
        <Fragment>
            <Head>
                <title>Reset Password | BrosBook</title>
            </Head>

            <div className="h-screen flex flex-col bg-theme-gray">
                <div className="w-90 mx-auto mt-12 lg:mt-28">
                    {isLoading || isSuccess && <LinearProgress />}

                    <div className="auth-box">
                        <div className="text-center mb-2">
                            <Lock fontSize="large" />
                        </div>
                        <h1 className="text-lg text-center mb-4 font-medium">Create a strong password</h1>
                        <small className="block text-gray-500 text-center mb-2">
                            Enter your your new password to reset account password.
                            Your password must be at least six characters.
                        </small>

                        <form method="post" onSubmit={submitForm}>
                            <PasswordInput
                                label="Password"
                                value={password}
                                error={inputErrors.password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <PasswordInput
                                label="Confirm Password"
                                value={confirmPassword}
                                error={inputErrors.confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <PrimaryButton fullWidth type="submit" title="Reset" isLoading={isLoading || isSuccess} />
                        </form>
                    </div>

                    <div className="auth-box text-center mt-2 py-6">
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

export default ResetPassword
