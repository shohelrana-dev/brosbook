"use client"
import { FormEvent, Fragment, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Alert, Divider, LinearProgress } from '@mui/material'
import zxcvbn from 'zxcvbn-typescript'
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"

import AnimatedInput from '@components/common/AnimatedInput'
import GoogleLoginButton from "@components/common/GoogleLoginButton"
import Button from "@components/common/Button"
import { useSignupMutation } from "@services/authApi"
import PasswordInput from "@components/common/PasswordInput"
import { SignupErrors } from "@interfaces/auth.interfaces";

export default function SignupPage() {
    //hooks
    const router = useRouter()
    const [signup, { isLoading, isSuccess }] = useSignupMutation()

    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const [inputErrors, setInputErrors] = useState<SignupErrors>({})
    const [passwordWarning, setPasswordWarning] = useState('')

    //handle form submit
    async function onSignupFormSubmit(event: FormEvent) {
        event.preventDefault()
        setInputErrors({})

        try {
            await signup({ firstName, lastName, email, username, password }).unwrap()
            router.push('/auth/email_verification/verification-required')
            toast.success('Signup success. You have received a mail to verify the account.')
        } catch (err: any) {
            console.error(err)
            setInputErrors(err?.data?.errors || {})
            toast.error(err?.data?.message || 'Please fix errors below.')
        }
    }

    function checkPasswordWarning() {
        setPasswordWarning(zxcvbn(password, [])?.feedback?.warning)
    }

    return (
        <Fragment>
            <Head>
                <title>Sign Up | BrosBook</title>
            </Head>

            <div className="h-screen flex flex-col bg-theme-gray">
                <div className="w-90 mx-auto mt-12 lg:mt-16">
                    {isLoading || isSuccess && <LinearProgress />}

                    <div className="auth-box">
                        <h1 className="text-xl text-center mb-4 font-medium">Sign Up</h1>

                        <GoogleLoginButton />

                        <div className="divider">OR</div>

                        <form method="post" onSubmit={onSignupFormSubmit}>
                            <AnimatedInput
                                label="First Name"
                                value={firstName}
                                error={inputErrors.firstName}
                                onChange={(e => setFirstName(e.target.value))}
                            />
                            <AnimatedInput
                                label="Last Name"
                                value={lastName}
                                error={inputErrors.lastName}
                                onChange={(e => setLastName(e.target.value))}
                            />
                            <AnimatedInput
                                label="Email"
                                value={email}
                                error={inputErrors.email}
                                onChange={(e => setEmail(e.target.value))}
                            />
                            <AnimatedInput
                                label="Username"
                                value={username}
                                error={inputErrors.username}
                                onChange={(e => setUsername(e.target.value))}
                            />
                            <PasswordInput
                                label="Password"
                                value={password}
                                error={inputErrors.password}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                    checkPasswordWarning()
                                }}
                            />
                            {passwordWarning && (
                                <Alert className="mb-2" variant="outlined"
                                    severity="warning">{passwordWarning}</Alert>
                            )}
                            <Button  className="w-full mt-3"  fullWidth type="submit" title="Sign Up" isLoading={isLoading || isSuccess} />
                        </form>

                        <div className="text-center">
                            <small className="text-gray-600">
                                By signing up, you agree to our Terms, Data Policy and Cookie Policy.
                            </small>
                        </div>

                    </div>

                    <div className="auth-box text-center mt-2">
                        <p className="text-gray-800">
                            Have an account?
                            <Link href="/auth/login" className="ml-1 text-blue-500 font-medium">
                                Log In
                            </Link>
                        </p>
                    </div>

                </div>
            </div>
        </Fragment>
    )
}
