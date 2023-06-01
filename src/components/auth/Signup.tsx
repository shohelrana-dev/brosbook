"use client"
import React, { useEffect, useState } from 'react'
import GoogleLoginButton from "@components/global/GoogleLoginButton"
import AnimatedInput from "@components/global/AnimatedInput"
import PasswordInput from "@components/global/PasswordInput"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSignupMutation } from "@services/authApi"
import { useForm } from "@hooks/useForm"
import { SignupPayload } from "@interfaces/auth.interfaces"
import toast from "react-hot-toast"
import { setEmail } from "@slices/authSlice"
import { useDispatch } from "react-redux"
import PasswordStrengthBar from 'react-password-strength-bar'
import LoadingOverlay from "@components/global/LoadingOverlay"
import tw from "twin.macro"
import { Box, FooterBox, Heading, Wrapper } from "@components/styles/Auth.styles"
import { Form } from "@components/styles/Global.styles"
import { Button, Divider } from '@mui/material'

const Policy = tw.p`text-center text-gray-600 text-xs mt-3`

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
        <Wrapper>
            <LoadingOverlay isLoading={ isLoading || isSuccess || isLoadingLoginWithGoogle }/>
            <Box>
                <Heading>Sign Up</Heading>

                <GoogleLoginButton setIsLoading={ setIsLoadingLoginWithGoogle }/>

                <Divider className="!my-5">OR</Divider>

                <Form method="post" onSubmit={ onSubmit }>
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

                    <Button variant="contained" type="submit">
                        Sign Up
                    </Button>
                </Form>

                <Policy>By signing up, you agree to our Terms, Data Policy and Cookie Policy.</Policy>
            </Box>

            <FooterBox>
                Have an account? &nbsp;
                <Link href="/auth/login">
                    Log In
                </Link>
            </FooterBox>
        </Wrapper>
    )
}