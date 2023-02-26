"use client"
import React, { useEffect, useState } from 'react'
import GoogleLoginButton from "@components/global/GoogleLoginButton"
import Divider from "@components/global/Divider"
import AnimatedInput from "@components/global/AnimatedInput"
import PasswordInput from "@components/global/PasswordInput"
import { Alert } from "@material-tailwind/react"
import Button from "@components/global/Button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSignupMutation } from "@services/authApi"
import { useForm } from "@hooks/useForm"
import { SignupPayload } from "@interfaces/auth.interfaces"
import toast from "react-hot-toast"
import { passwordStrength } from "check-password-strength"

export default function Signup(){
    //hooks
    const router                                   = useRouter()
    const [signup, { isLoading, isSuccess }]       = useSignupMutation()
    const { formData, onChange, onSubmit, errors } = useForm<SignupPayload>( signup )

    const [passwordWarning, setPasswordWarning] = useState( '' )

    useEffect( () => {
        if( isSuccess ){
            router.push( '/auth/email_verification/required' )
            toast.success( 'Signup success. You have received a mail to verify the account.' )
        }
    }, [isSuccess] )

    function checkPasswordWarning(){
        setPasswordWarning( passwordStrength( formData.password ).value )
    }

    return (
        <>
            <div className="auth-box">
                <h1 className="text-xl text-center mb-4 font-medium">Sign Up</h1>

                <GoogleLoginButton/>

                <Divider>OR</Divider>

                <form method="post" onSubmit={ onSubmit }>
                    <AnimatedInput
                        label="First Name"
                        name="firstName"
                        value={ formData.firstName }
                        error={ errors.firstName }
                        onChange={ onChange }
                    />
                    <AnimatedInput
                        label="Last Name"
                        name="lastName"
                        value={ formData.lastName }
                        error={ errors.lastName }
                        onChange={ onChange }
                    />
                    <AnimatedInput
                        label="Email"
                        name="email"
                        value={ formData.email }
                        error={ errors.email }
                        onChange={ onChange }
                    />
                    <AnimatedInput
                        label="Username"
                        name="username"
                        value={ formData.username }
                        error={ errors.username }
                        onChange={ onChange }
                    />
                    <PasswordInput
                        label="Password"
                        name="password"
                        value={ formData.password }
                        error={ errors.password }
                        onChange={ ( e ) => {
                            onChange( e )
                            checkPasswordWarning()
                        } }
                    />
                    { passwordWarning ? (
                        <Alert color="amber" className="mt-3 py-1">{ passwordWarning }</Alert>
                    ) : null }
                    <Button className="w-full mt-3" type="submit" isLoading={ isLoading || isSuccess }>
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
        </>
    )
}