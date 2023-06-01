import React, { useEffect } from 'react'
import PasswordInput from "@components/global/PasswordInput"
import BaseLink from "next/link"
import { useChangeUsernameMutation } from "@services/accountApi"
import { ChangeUsernamePayload } from "@interfaces/account.interfaces"
import toast from "react-hot-toast"
import { useForm } from "@hooks/useForm"
import AnimatedInput from "@components/global/AnimatedInput"
import Modal, { useModal } from "react-minimal-modal"
import useAuthState from "@hooks/useAuthState"
import tw from "twin.macro"
import { Form } from "@components/styles/Global.styles"
import {Button} from "@mui/material"
import { LoadingButton } from '@mui/lab'

const ButtonWrapper = tw.div`text-right`
const Link          = tw( BaseLink )`text-blue-600 text-xs block`

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
                <Button variant="outlined" onClick={ toggle } size="small">
                    Change
                </Button>
            </div>

            <Modal
                visible={ isVisible }
                toggle={ toggle }
                title="Update username"
            >
                <Form onSubmit={ onSubmit }>
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
                        <Link href="/auth/forgot_password">
                            Forgot password?
                        </Link>
                    </div>

                    <ButtonWrapper>
                        <LoadingButton variant='contained' type="submit" loading={ isLoading }>
                            Update
                        </LoadingButton>
                    </ButtonWrapper>
                </Form>
            </Modal>
        </>
    )
}
