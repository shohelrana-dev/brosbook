"use client"
import React, { useEffect } from 'react'
import { FiLock } from "react-icons/fi"
import Link from "next/link"
import ButtonOutline from "@components/global/ButtonOutline"
import AnimatedInput from "@components/global/AnimatedInput"
import Button from "@components/global/Button"
import { useForgotPasswordMutation } from "@services/authApi"
import { useForm } from "@hooks/useForm"
import toast from "react-hot-toast"
import { Box, Describe, FooterBox, Heading, Icon, Wrapper } from "@components/styles/Auth.styles"
import { Form } from "@components/styles/Global.styles"
import tw from "twin.macro"

const SuccessWrapper = tw.div`text-center [a]:(inline-block mt-5)`

export default function ForgotPassword(){
    //hooks
    const [forgotPassword, { isLoading, isSuccess }] = useForgotPasswordMutation()
    const { formData, onChange, onSubmit, errors }   = useForm<{ email: string }>( forgotPassword )

    useEffect( () => {
        if( isSuccess ) toast.success( 'An email has been sent to your email to reset your password.' )
    }, [isSuccess] )


    let content = null
    if( isSuccess ){
        content = (
            <SuccessWrapper>
                <Heading>Reset Password</Heading>
                <p>Check your email for a link to reset your password. If it doesn't appear
                    within a few minutes, check your spam folder.</p>
                <Link href="/auth/login">
                    <ButtonOutline size="sm">Return to login</ButtonOutline>
                </Link>
            </SuccessWrapper>
        )
    } else{
        content = (
            <Wrapper>
                <Heading>Trouble with logging in?</Heading>
                <Describe>
                    Enter your email address and we will send you a link to get back into your account.
                </Describe>

                <Form onSubmit={ onSubmit }>
                    <AnimatedInput
                        label="Email"
                        name="email"
                        value={ formData.email }
                        error={ errors.email }
                        onChange={ onChange }
                    />
                    <Button type="submit" fullWidth isLoading={ isLoading }>
                        Send Reset Link
                    </Button>
                </Form>
            </Wrapper>
        )
    }

    return (
        <Wrapper>
            <Box>
                <Icon>
                    <FiLock size="30"/>
                </Icon>

                { content }
            </Box>

            <FooterBox>
                Go back?&nbsp;
                <Link href="/auth/login">
                    Log In
                </Link>
            </FooterBox>
        </Wrapper>
    )
}