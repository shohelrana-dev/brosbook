import React, { useEffect } from 'react'
import PasswordInput from "@components/form/PasswordInput"
import Link from "next/link"
import { useChangeUsernameMutation } from "@services/accountApi"
import { ChangeUsernamePayload } from "@interfaces/account.interfaces"
import toast from "react-hot-toast"
import { useForm } from "@hooks/useForm"
import AnimatedInput from "@components/form/AnimatedInput"
import Modal, { useModal } from "react-minimal-modal"
import useAuthState from "@hooks/useAuthState"
import {Button} from "@mui/material"
import { LoadingButton } from '@mui/lab'

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
            <div>
                <Button variant="outlined" onClick={ toggle }>
                    Change
                </Button>
            </div>

            <Modal
                visible={ isVisible }
                toggle={ toggle }text-right
                title="Update username"
                width={700}
            >
                <p className="mb-6 text-gray-700 -mt-1">Set your new username using password.</p>
                <form className="form" onSubmit={ onSubmit }>
                    <AnimatedInput
                        label="Username"
                        name="username"
                        value={ formData.username }
                        error={ errors.username }
                        onChange={ onChange }
                    />
                    <div>
                        <PasswordInput
                            label="Password"
                            name="password"
                            value={ formData.password }
                            error={ errors.password }
                            onChange={ onChange }
                        />
                        <Link href="/auth/forgot_password" className="text-blue-600 text-sm block">
                            Forgot password?
                        </Link>
                    </div>

                    <div className="text-right">
                        <LoadingButton variant='contained' type="submit" loading={ isLoading } size="large">
                            Update
                        </LoadingButton>
                    </div>
                </form>
            </Modal>
        </>
    )
}
