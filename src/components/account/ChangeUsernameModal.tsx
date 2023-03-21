import React, { useEffect } from 'react'
import ButtonOutline from "@components/global/ButtonOutline"
import PasswordInput from "@components/global/PasswordInput"
import Link from "next/link"
import Button from "@components/global/Button"
import { useChangeUsernameMutation } from "@services/accountApi"
import { ChangeUsernamePayload } from "@interfaces/account.interfaces"
import toast from "react-hot-toast"
import { useForm } from "@hooks/useForm"
import AnimatedInput from "@components/global/AnimatedInput"
import Modal, { useModal } from "react-minimal-modal"
import useAuthState from "@hooks/useAuthState"

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
                visible={ isVisible }
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
                        wrapperClassname="mt-3"
                    />
                    <Link href="/auth/forgot_password" className="text-blue-600 text-xs block">
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
