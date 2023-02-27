"use client"
import React, { useEffect, useState } from 'react'
import GoogleLoginButton from "@components/global/GoogleLoginButton"
import Divider from "@components/global/Divider"
import AnimatedInput from "@components/global/AnimatedInput"
import PasswordInput from "@components/global/PasswordInput"
import Button from "@components/global/Button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSignupMutation } from "@services/authApi"
import { useForm } from "@hooks/useForm"
import { SignupPayload } from "@interfaces/auth.interfaces"
import toast from "react-hot-toast"
import { setEmail } from "@slices/authSlice"
import { useDispatch } from "react-redux"
import PasswordStrengthBar from 'react-password-strength-bar'
import FrontDropLoading from "@components/global/FrontDropLoading"

export default function Signup(){
    //hooks
    const dispatch                                                = useDispatch()
    const router                                                  = useRouter()
    const [signup, { isLoading, isSuccess }]                      = useSignupMutation()
    const { formData, onChange, onSubmit, errors }                = useForm<SignupPayload>( signup )
    const [isLoadingLoginWithGoogle, setIsLoadingLoginWithGoogle] = useState<boolean>( false )

    useEffect( () => {
        if( isSuccess ){
            dispatch( setEmail( formData.email ) )
            router.push( '/auth/email_verification/required' )
            toast.success( 'Signup success. You have received a mail to verify the account.' )
        }
    }, [isSuccess] )

    return (
        <div className="relative z-50">
            <FrontDropLoading isLoading={ isLoading || isSuccess || isLoadingLoginWithGoogle }/>
            <div className="auth-box">
                <h1 className="text-xl text-center mb-4 font-medium">Sign Up</h1>

                <GoogleLoginButton setIsLoading={ setIsLoadingLoginWithGoogle }/>

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
                        onChange={ onChange }
                    />
                    { formData.password ? <PasswordStrengthBar password={ formData.password }/> : null }

                    <Button className="w-full mt-3" type="submit">
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
    )
}