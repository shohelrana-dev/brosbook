import React, { useEffect } from 'react'
import ButtonOutline from "@components/global/ButtonOutline"
import PasswordInput from "@components/global/PasswordInput"
import Button from "@components/global/Button"
import { useChangePasswordMutation } from "@services/accountApi"
import { ChangePasswordPayload } from "@interfaces/account.interfaces"
import toast from "react-hot-toast"
import { useForm } from "@hooks/useForm"
import Modal, { useModal } from "react-minimal-modal"
import { Form } from "@components/styles/Global.styles"
import tw from "twin.macro"
import BaseLink from "next/link"

const ButtonWrapper = tw.div`text-right [button[type=submit]]:mt-4`
const Link          = tw( BaseLink )`text-blue-600 text-xs block`

export default function ChangePasswordModal(){
    const [changePassword, { isLoading, isSuccess }]      = useChangePasswordMutation()
    const { formData, onChange, onSubmit, errors, reset } = useForm<ChangePasswordPayload>( changePassword )
    const { toggle, isVisible }                           = useModal()

    useEffect( () => {
        if( isSuccess ){
            toast.success( 'Password changed.' )
            toggle()
        }
    }, [isSuccess] )

    useEffect( () => {
        if( ! isVisible ) reset()
    }, [isVisible] )

    return (
        <>
            <ButtonOutline onClick={ toggle } type="button" size="sm">
                Change
            </ButtonOutline>

            <Modal visible={ isVisible } toggle={ toggle } title="Update your password">
                <Form onSubmit={ onSubmit }>
                    <div>
                        <PasswordInput
                            label="Current Password"
                            name="currentPassword"
                            value={ formData.currentPassword }
                            error={ errors.currentPassword }
                            onChange={ onChange }
                        />
                        <Link href="/auth/forgot_password">
                            Forgot password?
                        </Link>
                    </div>
                    <PasswordInput
                        label="New Password"
                        name="newPassword"
                        value={ formData.newPassword }
                        error={ errors.newPassword }
                        onChange={ onChange }
                    />
                    <PasswordInput
                        label="Confirm New Password"
                        name="confirmNewPassword"
                        value={ formData.confirmNewPassword }
                        error={ errors.confirmNewPassword }
                        onChange={ onChange }
                    />

                    <ButtonWrapper>
                        <Button type="submit" isLoading={ isLoading }>
                            Update
                        </Button>
                    </ButtonWrapper>
                </Form>
            </Modal>
        </>
    )
}
