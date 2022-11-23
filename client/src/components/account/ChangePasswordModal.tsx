import React, {useEffect, useState} from 'react'
import ButtonOutline from "@components/common/ButtonOutline"
import PasswordInput from "@components/common/PasswordInput"
import Link from "next/link"
import Button from "@components/common/Button"
import {useChangePasswordMutation} from "@services/accountApi"
import {ChangePasswordPayload} from "@interfaces/account.interfaces"
import {toast} from "react-toastify"
import {useForm} from "@hooks/useForm"
import Modal from "@components/common/Modal"

export default function ChangePasswordModal() {
    const [changePassword, { isLoading, isSuccess }] = useChangePasswordMutation()
    const {formData, onChange, onSubmit, errors} = useForm<ChangePasswordPayload>(changePassword)

    const [isModalOpen, setIsModalOpen] = useState(false)

    function handleModalOpen(){
        setIsModalOpen(!isModalOpen)
    }

    useEffect(()=> {
        if(isSuccess) toast.success('Password changing was success.')
    }, [isSuccess])

    return (
        <>
            <ButtonOutline onClick={handleModalOpen} type="button" size="sm">
                Change
            </ButtonOutline>

            <Modal isOpen={isModalOpen} onClose={handleModalOpen}>
                <form onSubmit={onSubmit}>
                    <h3 className="text-lg mb-3">Update your password</h3>
                    <PasswordInput
                        label="Current Password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        error={errors.currentPassword}
                        onChange={onChange}
                    />
                    <Link href="/auth/forgot_password" className="text-blue-600 text-xs">
                        Forgot password?
                    </Link>
                    <PasswordInput
                        label="New Password"
                        name="newPassword"
                        value={formData.newPassword}
                        error={errors.newPassword}
                        onChange={onChange}
                    />
                    <PasswordInput
                        label="Confirm New Password"
                        name="confirmNewPassword"
                        value={formData.confirmNewPassword}
                        error={errors.confirmNewPassword}
                        onChange={onChange}
                    />

                    <Button type="submit" isLoading={isLoading} className="!mt-5">
                        Update
                    </Button>
                </form>
            </Modal>
        </>
    )
}
