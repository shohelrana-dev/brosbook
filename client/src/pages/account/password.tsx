import React, { FormEvent, useState } from 'react'
import { useSelector } from "react-redux"
import Link from 'next/link'

import Avatar from "@components/common/Avatar"
import MainLayout from "@components/layouts/MainLayout"
import LeftSidebar from "@components/account/LeftSidebar"
import ensureServerSideAuth from "@utils/ensureServerSideAuth"
import { selectAuthState } from "@slices/authSlice"
import AnimatedInput from '@components/common/AnimatedInput'
import PrimaryButton from '@components/common/PrimaryButton'
import { ChangePasswordErrors } from '@interfaces/account.interfaces'
import PasswordInput from '@components/common/PasswordInput'
import { useChangePasswordMutation } from '@services/accountApi'
import { toast } from 'react-toastify'

function Password() {
    //hooks
    const { user } = useSelector(selectAuthState)
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

    return (
        <MainLayout showSidebar={false}>
            <div className=" pt-6">
                <div className="flex gap-3">
                    {/*sidebar*/}
                    <LeftSidebar />

                    {/*Form*/}
                    <form className="box w-full flex-auto p-3 pb-8" onSubmit={onSubmitForm}>
                        <div className="flex items-center">
                            <div className="w-3/12 flex justify-end p-4">
                                <Avatar online={false} src={user.photo} alt={user.username} />
                            </div>
                            <div className="flex-auto p-4">
                                <h3 className="text-xl">{user.username}</h3>
                            </div>
                        </div>

                        <PasswordInput
                            label="Current Password"
                            size="medium"
                            value={currentPassword}
                            error={inputErrors.currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <Link href="/auth/forgot_password">
                            <a className="text-blue-600 text-sm">
                                Forgot password?
                            </a>
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

                        <PrimaryButton type="submit" title="Change Password" className="mt-3" />

                    </form>

                </div>
            </div>
        </MainLayout>
    )
}

export default Password

export const getServerSideProps = ensureServerSideAuth