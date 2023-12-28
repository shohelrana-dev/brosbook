"use client"
import React, { useEffect } from 'react'
import { FiLock } from "react-icons/fi"
import PasswordInput from "@components/global/PasswordInput"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useResetPasswordMutation } from "@services/authApi"
import { useForm } from "@hooks/useForm"
import { ResetPassPayload } from "@interfaces/auth.interfaces"
import toast from "react-hot-toast"
import { LoadingButton } from '@mui/lab'

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
        <>
            <div className='auth-box'>
                <div className="flex flex-wrap justify-center mb-2">
                    <FiLock size="30"/>
                </div>

                <h1 className="auth-heading">Create a strong password</h1>
                <small className="block text-gray-500 text-center mb-2">
                    Enter your new password to reset account password.
                    Your password must be at least six characters.
                </small>

                <form className="form" method="post" onSubmit={ onSubmit }>
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
                    <LoadingButton variant="contained" type="submit" loading={ isLoading || isSuccess }>
                        Reset
                    </LoadingButton>
                </form>
            </div>

            <div className="auth-box text-center mt-2 text-gray-800">
                Go back? &nbsp;
                <Link href="/auth/login" className="text-blue-500 font-medium">
                    Log In
                </Link>
            </div>
        </>
    )
}