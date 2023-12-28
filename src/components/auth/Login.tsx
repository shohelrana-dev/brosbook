"use client"
import React, { useEffect, useState } from 'react'
import { FiLock } from "react-icons/fi"
import AnimatedInput from "@components/global/AnimatedInput"
import PasswordInput from "@components/global/PasswordInput"
import GoogleLoginButton from "@components/global/GoogleLoginButton"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useLoginMutation } from "@services/authApi"
import { useForm } from "@hooks/useForm"
import { CredentialPayload } from "@interfaces/auth.interfaces"
import toast from "react-hot-toast"
import { useDispatch } from "react-redux"
import { setEmail } from "@slices/authSlice"
import LoadingOverlay from "@components/global/LoadingOverlay"
import { baseApi } from "@services/baseApi"
import { Button, Divider } from "@mui/material"

export default function Login() {
    //hooks
    const dispatch                                                  = useDispatch()
    const router                                                    = useRouter()
    const params                                                    = useSearchParams()
    const [ login, { isLoading, isSuccess, data } ]                 = useLoginMutation()
    const { formData, onChange, onSubmit, errors }                  = useForm<CredentialPayload>(login)
    const [ isLoadingLoginWithGoogle, setIsLoadingLoginWithGoogle ] = useState<boolean>(false)

    useEffect(() => {
        if ( isSuccess ) {
            if ( data?.user?.hasEmailVerified ) {
                dispatch(baseApi.util.resetApiState())
                router.replace(params.get('redirect_to') ? params.get('redirect_to')! : '/')
                toast.success('Logged in.')
            } else {
                dispatch(setEmail(data?.user?.email!))
                router.push('/auth/email_verification/required')
                toast.error('Your email not verified yet.')
            }
        }
    }, [ isSuccess ])

    return (
        <>
            <LoadingOverlay isLoading={ isLoading || isSuccess || isLoadingLoginWithGoogle }/>
            <div className='auth-box'>
                <div className='flex flex-wrap justify-center mb-2'>
                    <FiLock size="30"/>
                </div>
                <h1 className='auth-heading'>
                    Log In to { process.env.NEXT_PUBLIC_APP_NAME || 'Brosbook' }
                </h1>

                <form className="form" method="post" onSubmit={ onSubmit }>
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
                    <Button variant='contained' type="submit" fullWidth>
                        Log In
                    </Button>
                </form>

                <Divider className="!my-5">OR</Divider>

                <GoogleLoginButton setIsLoading={ setIsLoadingLoginWithGoogle }/>

                <small className="block text-center mt-2">
                    <Link href="/auth/forgot_password" className="text-blue-500">
                        Forgotten your password?
                    </Link>
                </small>
            </div>

            <div className="auth-box text-center mt-2 text-gray-800">
                Don't have an account? &nbsp;
                <Link href="/auth/signup" className="text-blue-500 font-medium">
                    Sign Up
                </Link>
            </div>
        </>
    )
}