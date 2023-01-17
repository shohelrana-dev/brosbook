"use client"
import { useEffect, useState} from 'react'
import Link from 'next/link'
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import {Alert} from "@material-tailwind/react"
import { passwordStrength } from 'check-password-strength'

import AnimatedInput from '@components/common/AnimatedInput'
import GoogleLoginButton from "@components/common/GoogleLoginButton"
import Button from "@components/common/Button"
import { useSignupMutation } from "@services/authApi"
import PasswordInput from "@components/common/PasswordInput"
import {SignupPayload} from "@interfaces/auth.interfaces"
import Divider from "@components/common/Divider"
import {useForm} from "@hooks/useForm"

export default function SignupPage() {
    //hooks
    const router = useRouter()
    const [signup, { isLoading, isSuccess }] = useSignupMutation()
    const {formData, onChange, onSubmit, errors} = useForm<SignupPayload>(signup)

    const [passwordWarning, setPasswordWarning] = useState('')

    useEffect(()=> {
        if(isSuccess){
            router.push('/auth/email_verification/required')
            toast.success('Signup success. You have received a mail to verify the account.')
        }
    }, [isSuccess])

    function checkPasswordWarning() {
        setPasswordWarning(passwordStrength(formData.password).value)
    }

    return (
        <div className="h-screen flex flex-col bg-theme-gray">
            <div className="w-90 mx-auto mt-12 lg:mt-16">
                <div className="auth-box">
                    <h1 className="text-xl text-center mb-4 font-medium">Sign Up</h1>

                    <GoogleLoginButton />

                    <Divider>OR</Divider>

                    <form method="post" onSubmit={onSubmit}>
                        <AnimatedInput
                            label="First Name"
                            name="firstName"
                            value={formData.firstName}
                            error={errors.firstName}
                            onChange={onChange}
                        />
                        <AnimatedInput
                            label="Last Name"
                            name="lastName"
                            value={formData.lastName}
                            error={errors.lastName}
                            onChange={onChange}
                        />
                        <AnimatedInput
                            label="Email"
                            name="email"
                            value={formData.email}
                            error={errors.email}
                            onChange={onChange}
                        />
                        <AnimatedInput
                            label="Username"
                            name="username"
                            value={formData.username}
                            error={errors.username}
                            onChange={onChange}
                        />
                        <PasswordInput
                            label="Password"
                            name="password"
                            value={formData.password}
                            error={errors.password}
                            onChange={(e) => {
                                onChange(e)
                                checkPasswordWarning()
                            }}
                        />
                        {passwordWarning ? (
                            <Alert color="amber" className="mt-3 py-1">{passwordWarning}</Alert>
                        ) : null}
                        <Button className="w-full mt-3" type="submit" isLoading={isLoading || isSuccess} >
                            Sign Up
                        </Button>
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
    )
}
