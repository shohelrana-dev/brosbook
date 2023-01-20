"use client"
import { useEffect} from 'react'
import { useRouter } from "next/navigation"
import Link from "next/link"
import toast from "react-hot-toast"
import {FiLock} from "react-icons/fi"

import Button from "@components/common/Button"
import { useResetPasswordMutation } from "@services/authApi"
import PasswordInput from "@components/common/PasswordInput"
import {ResetPassPayload} from "@interfaces/auth.interfaces"
import {useForm} from "@hooks/useForm"

type Props = {
    params: {token: string}
}

export default function ResetPasswordPage({params}: Props) {
    //hooks
    const router = useRouter()
    const [resetPassword, { isLoading, isSuccess }] = useResetPasswordMutation()
    const {formData, onChange, onSubmit, errors} = useForm<ResetPassPayload>(resetPassword, {
        token: params.token,
        password: '',
        confirmPassword: ''
    })

    useEffect(()=> {
        if(isSuccess){
            toast.success('Your login password has been changed.')
            router.push('/auth/login')
        }
    }, [isSuccess])

    return (
        <div className="h-screen flex flex-col bg-theme-gray">
            <div className="w-90 mx-auto mt-12 lg:mt-28">

                <div className="auth-box">
                    <div className="flex justify-center mb-2">
                        <FiLock size="30"/>
                    </div>

                    <h1 className="text-lg text-center mb-4 font-medium">Create a strong password</h1>
                    <small className="block text-gray-500 text-center mb-2">
                        Enter your new password to reset account password.
                        Your password must be at least six characters.
                    </small>

                    <form method="post" onSubmit={onSubmit}>
                        <PasswordInput
                            label="Password"
                            name="password"
                            value={formData.password}
                            error={errors.password}
                            onChange={onChange}
                        />
                        <PasswordInput
                            label="Confirm Password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            error={errors.confirmPassword}
                            onChange={onChange}
                        />
                        <Button className="w-full mt-3" type="submit" isLoading={isLoading || isSuccess} >
                            Reset
                        </Button>
                    </form>
                </div>

                <div className="auth-box text-center mt-2 py-6">
                    <p className="text-gray-800">
                        Go back?
                        <Link href="/auth/login" className="ml-1 text-blue-500 font-medium">
                            Log In
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    )
}
