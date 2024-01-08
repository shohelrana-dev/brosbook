import React, { useEffect } from 'react'
import PasswordInput from "@/components/form/PasswordInput"
import { useChangePasswordMutation } from "@/services/accountApi"
import { ChangePasswordPayload } from "@/interfaces/account.interfaces"
import toast from "react-hot-toast"
import { useForm } from "@/hooks/useForm"
import Modal, { useModal } from "react-minimal-modal"
import Link from "next/link"
import { LoadingButton } from '@mui/lab'
import { Button } from '@mui/material'

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
            <div>
                <Button variant='outlined' onClick={ toggle }>
                    Change
                </Button>                                                   
            </div>

            <Modal visible={ isVisible } toggle={ toggle } title="Update your password" width={700}>
                <p className="mb-6 text-gray-700 -mt-1">
                    Do not share your password with anyone. Set new password using current password.
                </p>
                <form className="form" onSubmit={ onSubmit }>
                    <div>
                        <PasswordInput
                            label="Current Password"
                            name="currentPassword"
                            value={ formData.currentPassword }
                            error={ errors.currentPassword }
                            onChange={ onChange }
                        />
                        <Link href="/auth/forgot_password" className="text-blue-600 text-sm block">
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

                    <div className="text-right mt-4">
                        <LoadingButton variant="contained" type="submit" loading={ isLoading } size="large">
                            Update
                        </LoadingButton>
                    </div>
                </form>
            </Modal>
        </>
    )
}
