import React, { FormEvent, useState } from 'react'
import Link from 'next/link'

import Avatar from "@components/common/Avatar"
import Button from '@components/common/Button'
import { ChangePasswordErrors } from '@interfaces/account.interfaces'
import PasswordInput from '@components/common/PasswordInput'
import { useChangePasswordMutation } from '@services/accountApi'
import { toast } from 'react-toastify'
import useAuth from "@hooks/useAuth"

export default function ChangePasswordModal() {
    //hooks
    const { user } = useAuth()
    const [changePassword, { isLoading }] = useChangePasswordMutation()
    const [inputErrors, setInputErrors] = useState<ChangePasswordErrors>({})

    const [currentPassword, setCurrentPassword] = useState<string>('')
    const [newPassword, setNewPassword] = useState<string>('')
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>('')

    async function onSubmitForm(event: FormEvent) {
        event.preventDefault()

        try {
            await changePassword({ currentPassword, newPassword, confirmNewPassword }).unwrap()
            toast.success('Password has been changed.')
            setCurrentPassword('')
            setNewPassword('')
            setConfirmNewPassword('')
        } catch (err: any) {
            console.error(err)
            toast.error(err?.data?.message || 'Password has not been changed.')
            setInputErrors(err?.data?.errors || {})
        }
    }

    return(
        <>
            <input type="checkbox" id="change-password-modal" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box relative">
                    <label htmlFor="change-password-modal" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>

                        <form className="flex-auto p-3 pb-8" onSubmit={onSubmitForm}>
                            <h3 className="text-lg mb-3">Update your password</h3>

                            <PasswordInput
                                label="Current Password"
                                size="medium"
                                value={currentPassword}
                                error={inputErrors.currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                            <Link href="/auth/forgot_password" className="text-blue-600 text-sm">
                                Forgot password?
                            </Link>
                            <PasswordInput
                                label="New Password"
                                size="medium"
                                value={newPassword}
                                error={inputErrors.newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <PasswordInput
                                label="Confirm New Password"
                                size="medium"
                                value={confirmNewPassword}
                                error={inputErrors.confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                            />

                            <Button type="submit" title="Change Password" className="mt-3" />

                        </form>

                </div>
            </div>
        </>
    )
}