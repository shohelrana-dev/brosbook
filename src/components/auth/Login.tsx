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
import LoadingOverlay from "@components/global/LoadingOverlay"
import tw from 'twin.macro'
import { Wrapper, Box, FooterBox, Heading, Icon } from "@components/styles/Auth.styles"
import { Form } from "@components/styles/Global.styles"
import {baseApi} from "@services/baseApi";

const Forgotten = tw.small`block text-center mt-2 [a]:text-blue-500`

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
                dispatch(baseApi.util.resetApiState())
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
        <Wrapper>
            <LoadingOverlay isLoading={ isLoading || isSuccess || isLoadingLoginWithGoogle }/>
            <Box>
                <Icon>
                    <FiLock size="30"/>
                </Icon>
                <Heading>
                    Log In to { process.env.NEXT_PUBLIC_APP_NAME || 'Brosbook' }
                </Heading>
                <Form method="post" onSubmit={ onSubmit }>
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
                    <Button type="submit" fullWidth>
                        Log In
                    </Button>
                </Form>

                <Divider>OR</Divider>

                <GoogleLoginButton setIsLoading={ setIsLoadingLoginWithGoogle }/>

                <Forgotten>
                    <Link href="/auth/forgot_password">
                        Forgotten your password?
                    </Link>
                </Forgotten>
            </Box>

            <FooterBox>
                Don't have an account? &nbsp;
                <Link href="/auth/signup">
                    Sign Up
                </Link>
            </FooterBox>
        </Wrapper>
    )
}