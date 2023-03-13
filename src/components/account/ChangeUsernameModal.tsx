import React, { useEffect, useState } from 'react'
import ButtonOutline from "@components/global/ButtonOutline"
import PasswordInput from "@components/global/PasswordInput"
import Link from "next/link"
import Button from "@components/global/Button"
import { useChangeUsernameMutation } from "@services/accountApi"
import { ChangeUsernamePayload } from "@interfaces/account.interfaces"
import toast from "react-hot-toast"
import { useForm } from "@hooks/useForm"
import AnimatedInput from "@components/global/AnimatedInput"
import Modal from "@components/global/Modal"
import useAuthState from "@hooks/useAuthState"
import useModal from "@hooks/useModal"

export default function ChangeUsernameModal(){
    const { user }                                   = useAuthState()
    const [changeUsername, { isLoading, isSuccess }] = useChangeUsernameMutation()
    const {
              formData,
              onChange,
              onSubmit,
              errors,
              reset
          }                                          = useForm<ChangeUsernamePayload>( changeUsername, {
        username: user?.username!,
        password: ''
    } )
    const { toggle, isVisible }                      = useModal()

    useEffect( () => {
        if( ! isVisible ) reset()
    }, [isVisible] )

    useEffect( () => {
        if( isSuccess ){
            toast.success( 'Username changed.' )
            toggle()
        }
    }, [isSuccess] )

    return (
        <>
            <ButtonOutline onClick={ toggle } type="button" size="sm">
                Change
            </ButtonOutline>

            <Modal
                isVisible={ isVisible }
                toggle={ toggle }
                title="Update username"
            >
                <form onSubmit={ onSubmit }>
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
                    <Link href="/auth/forgot_password" className="text-blue-600 text-xs">
                        Forgot password?
                    </Link>

                    <div className="text-right">
                        <Button type="submit" isLoading={ isLoading }>
                            Update
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    )
}
