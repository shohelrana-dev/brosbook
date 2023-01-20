"use client"
import {useEffect} from 'react'
import Link from "next/link"
import {FiLock} from "react-icons/fi"
import toast from "react-hot-toast"

import AnimatedInput from "@components/common/AnimatedInput"
import Button from "@components/common/Button"
import { useForgotPasswordMutation } from "@services/authApi"
import {useForm} from "@hooks/useForm"
import ButtonOutline from "@components/common/ButtonOutline"

export default function ForgotPasswordPage() {
    //hooks
    const [forgotPassword, { isLoading, isSuccess }] = useForgotPasswordMutation()
    const {formData, onChange, onSubmit, errors} = useForm<{email: string}>(forgotPassword)

    useEffect(()=> {
        if(isSuccess) toast.success('A reset password link has been sent to your email.')
    }, [isSuccess])

    return (
        <div className="h-screen flex flex-col bg-theme-gray">
            <div className="w-90 mx-auto mt-12 lg:mt-28">

                <div className="auth-box">
                    <div className="flex justify-center mb-2">
                        <FiLock size="30"/>
                    </div>

                    {isSuccess ? (
                        <div className="text-center">
                            <h1 className="text-xl text-center mb-4 font-medium">Reset Password</h1>
                            <p className="mb-3">Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.</p>
                            <Link href="/auth/login">
                                <ButtonOutline>Return to login</ButtonOutline>
                            </Link>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-xl text-center mb-4 font-medium">Trouble with logging in?</h1>
                            <small className="block text-gray-500 text-center mb-2">
                                Enter your email address and we will send you a link to get back into your account.
                            </small>

                            <form onSubmit={onSubmit}>
                                <AnimatedInput
                                    label="Email"
                                    name="email"
                                    value={formData.email}
                                    className="mb-3"
                                    error={errors.email}
                                    onChange={onChange}
                                />
                                <Button type="submit" className="w-full mt-3" fullWidth isLoading={isLoading}>
                                    Send Reset Link
                                </Button>
                            </form>
                        </>
                    )}

                </div>

                <div className="auth-box text-center mt-2">
                    <p className="text-gray-800">
                        Go back?
                        <Link href="/auth/login" className="ml-1 text-blue-500 font-medium">
                            Log In
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    )
}
