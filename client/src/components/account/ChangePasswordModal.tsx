import React, {useEffect, useState} from 'react'
import Modal, {ModalTransition} from '@atlaskit/modal-dialog'
import { ImCross as CrossIcon } from "react-icons/im"
import ButtonOutline from "@components/common/ButtonOutline"
import PasswordInput from "@components/common/PasswordInput"
import Link from "next/link"
import Button from "@components/common/Button"
import {useChangePasswordMutation} from "@services/accountApi"
import {ChangePasswordPayload} from "@interfaces/account.interfaces"
import {toast} from "react-toastify"
import {useForm} from "@hooks/useForm"

export default function ChangePasswordModal() {
    const [changePassword, { isLoading, isSuccess }] = useChangePasswordMutation()
    const {formData, onChange, onSubmit, errors} = useForm<ChangePasswordPayload>(changePassword)

    const [isModalOpen, setIsModalOpen] = useState(false)

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen)
    }

    useEffect(()=> {
        if(isSuccess) toast.success('Password changing was success.')
    }, [isSuccess])

    return (
        <>
            <ButtonOutline onClick={toggleModal} type="button">
                Change
            </ButtonOutline>

            <ModalTransition>
                {isModalOpen ? (
                    <Modal onClose={toggleModal}>
                        <div className="flex justify-end p-1">
                            <button className="icon" onClick={toggleModal}>
                                <CrossIcon size="15"/>
                            </button>
                        </div>
                        <form className="flex-auto p-3 px-8 pt-6 pb-12" onSubmit={onSubmit}>
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
                ): null}
            </ModalTransition>
        </>
    )
}
