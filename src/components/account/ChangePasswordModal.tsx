import React, { useEffect } from 'react'
import ButtonOutline from "@components/global/ButtonOutline"
import PasswordInput from "@components/global/PasswordInput"
import Link from "next/link"
import Button from "@components/global/Button"
import { useChangePasswordMutation } from "@services/accountApi"
import { ChangePasswordPayload } from "@interfaces/account.interfaces"
import toast from "react-hot-toast"
import { useForm } from "@hooks/useForm"
import Modal from "@components/global/Modal"
import useModal from "@hooks/useModal"

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

            <Modal isVisible={ isVisible } toggle={ toggle } title="Update your password">
                <form onSubmit={ onSubmit }>
                    <PasswordInput
                        label="Current Password"
                        name="currentPassword"
                        value={ formData.currentPassword }
                        error={ errors.currentPassword }
                        onChange={ onChange }
                    />
                    <Link href="/auth/forgot_password" className="text-blue-600 text-xs">
                        Forgot password?
                    </Link>
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

                    <div className="text-right">
                        <Button type="submit" isLoading={ isLoading } className="!mt-5">
                            Update
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    )
}
