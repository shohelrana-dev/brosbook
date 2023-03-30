"use client"
import React, { useEffect } from 'react'
import { FiLock } from "react-icons/fi"
import PasswordInput from "@components/global/PasswordInput"
import Button from "@components/global/Button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useResetPasswordMutation } from "@services/authApi"
import { useForm } from "@hooks/useForm"
import { ResetPassPayload } from "@interfaces/auth.interfaces"
import toast from "react-hot-toast"
import { Box, Describe, FooterBox, Heading, Icon, Wrapper } from "@components/styles/Auth.styles"
import { Form } from "@components/styles/Global.styles"

export default function ResetPassword( { token }: { token: string } ){
    //hooks
    const router                                    = useRouter()
    const [resetPassword, { isLoading, isSuccess }] = useResetPasswordMutation()
    const { formData, onChange, onSubmit, errors }  = useForm<ResetPassPayload>( resetPassword, {
        token: token,
        password: '',
        confirmPassword: ''
    } )

    useEffect( () => {
        if( isSuccess ){
            toast.success( 'Your login password has been changed.' )
            router.push( '/auth/login' )
        }
    }, [isSuccess] )

    return (
        <Wrapper>
            <Box>
                <Icon>
                    <FiLock size="30"/>
                </Icon>

                <Heading>Create a strong password</Heading>
                <Describe>
                    Enter your new password to reset account password.
                    Your password must be at least six characters.
                </Describe>

                <Form method="post" onSubmit={ onSubmit }>
                    <PasswordInput
                        label="Password"
                        name="password"
                        value={ formData.password }
                        error={ errors.password }
                        onChange={ onChange }
                    />
                    <PasswordInput
                        label="Confirm Password"
                        name="confirmPassword"
                        value={ formData.confirmPassword }
                        error={ errors.confirmPassword }
                        onChange={ onChange }
                    />
                    <Button type="submit" isLoading={ isLoading || isSuccess }>
                        Reset
                    </Button>
                </Form>
            </Box>

            <FooterBox>
                Go back? &nbsp;
                <Link href="/auth/login">
                    Log In
                </Link>
            </FooterBox>
        </Wrapper>
    )
}