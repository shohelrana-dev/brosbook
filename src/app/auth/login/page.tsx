"use client"
import { useEffect } from 'react'
import Link from 'next/link'
import { FiLock } from "react-icons/fi"
import toast from "react-hot-toast"

import AnimatedInput from '@components/global/AnimatedInput'
import GoogleLoginButton from '@components/global/GoogleLoginButton'
import Button from "@components/global/Button"
import { useRouter, useSearchParams } from "next/navigation"
import { useLoginMutation } from "@services/authApi"
import PasswordInput from "@components/global/PasswordInput"
import { CredentialPayload } from "@interfaces/auth.interfaces"
import Divider from "@components/global/Divider"
import { useForm } from "@hooks/useForm"

function LoginPage(){
    //hooks
    const router                                   = useRouter()
    const params                                   = useSearchParams()
    const [login, { isLoading, isSuccess, data }]  = useLoginMutation()
    const { formData, onChange, onSubmit, errors } = useForm<CredentialPayload>( login )

    useEffect( () => {
        if( isSuccess ){
            if( data?.user?.hasEmailVerified ){
                router.push( params.get( 'redirect_to' ) ? params.get( 'redirect_to' )! : '/' )
                toast.success( 'Logged in.' )
            } else{
                localStorage.setItem( 'email', data?.user?.email! || '' )
                router.push( '/auth/email_verification/required' )
                toast.error( 'Your email not verified yet.' )
            }
        }
    }, [isSuccess] )

    return (
        <div className="h-screen flex flex-col bg-theme-gray">
            <div className="w-90 mx-auto mt-12 lg:mt-28">
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
                        />
                        <Button className="w-full mt-3" type="submit" isLoading={ isLoading || isSuccess }>
                            Log In
                        </Button>
                    </form>

                    <Divider>OR</Divider>

                    <GoogleLoginButton/>

                    <small className="block text-center">
                        <Link href="/auth/forgot_password" className="text-blue-500">
                            Forgotten your password?
                        </Link>
                    </small>
                </div>

                <div className="auth-box text-center mt-2">
                    <p className="text-gray-800">
                        Don&apos;t have an account?
                        <Link href="/auth/signup" className="ml-1 text-blue-500 font-medium">
                            Sign Up
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    )
}

export default LoginPage
