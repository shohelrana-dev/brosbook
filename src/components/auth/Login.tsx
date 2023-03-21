"use client"
import React, { useEffect, useState } from 'react'
import { FiLock } from "react-icons/fi"
import AnimatedInput from "@components/global/AnimatedInput"
import PasswordInput from "@components/global/PasswordInput"
import Button from "@components/global/Button"
import Divider from "@components/global/Divider"
import GoogleLoginButton from "@components/global/GoogleLoginButton"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useLoginMutation } from "@services/authApi"
import { useForm } from "@hooks/useForm"
import { CredentialPayload } from "@interfaces/auth.interfaces"
import toast from "react-hot-toast"
import { useDispatch } from "react-redux"
import { setEmail } from "@slices/authSlice"
import FrontDropLoading from "@components/global/FrontDropLoading"

export default function Login(){
    //hooks
    const dispatch                                                = useDispatch()
    const router                                                  = useRouter()
    const params                                                  = useSearchParams()
    const [login, { isLoading, isSuccess, data }]                 = useLoginMutation()
    const { formData, onChange, onSubmit, errors }                = useForm<CredentialPayload>( login )
    const [isLoadingLoginWithGoogle, setIsLoadingLoginWithGoogle] = useState<boolean>( false )

    useEffect( () => {
        if( isSuccess ){
            if( data?.user?.hasEmailVerified ){
                router.replace( params.get( 'redirect_to' ) ? params.get( 'redirect_to' )! : '/' )
                toast.success( 'Logged in.' )
            } else{
                dispatch( setEmail( data?.user?.email! ) )
                router.push( '/auth/email_verification/required' )
                toast.error( 'Your email not verified yet.' )
            }
        }
    }, [isSuccess] )

    return (
        <div className="relative z-50">
            <FrontDropLoading isLoading={ isLoading || isSuccess || isLoadingLoginWithGoogle }/>

            <div className="auth-box">
                <div className="flex justify-center mb-2">
                    <FiLock size="30"/>
                </div>
                <h1 className="text-xl text-center mb-4 font-medium">Log In
                    to { process.env.NEXT_PUBLIC_APP_NAME || 'Brosbook' }</h1>
                <form method="post" onSubmit={ onSubmit } className="mb-2">
                    <AnimatedInput
                        label="Username or email"
                        name="username"
                        value={ formData.username }
                        error={ errors?.username }
                        onChange={ onChange }
                    />
                    <PasswordInput
                        label="Password"
                        name="password"
                        value={ formData.password }
                        error={ errors?.password }
                        onChange={ onChange }
                        wrapperClassname="mt-3"
                    />
                    <Button className="w-full mt-3" type="submit">
                        Log In
                    </Button>
                </form>

                <Divider>OR</Divider>

                <GoogleLoginButton setIsLoading={ setIsLoadingLoginWithGoogle }/>

                <small className="block text-center">
                    <Link href="/auth/forgot_password" className="text-blue-500">
                        Forgotten your password?
                    </Link>
                </small>
            </div>

            <div className="auth-box text-center mt-2">
                <p className="text-gray-800">
                    Don&apost have an account?
                    <Link href="/auth/signup" className="ml-1 text-blue-500 font-medium">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    )
}