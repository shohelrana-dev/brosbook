"use client"
import React from 'react'
import useAuth from "@hooks/useAuth"
import Loading from "@components/common/Loading"
import ButtonOutline from "@components/common/ButtonOutline"
import ChangePasswordModal from "@components/account/ChangePasswordModal"
import ChangeUsernameModal from "@components/account/ChangeUsernameModal"

export default function GeneralSettingsPage(){
    const {user, isAuthenticated} = useAuth('/auth/login')

    if(!isAuthenticated) return <Loading/>

    return(
        <div className="p-4">
            <div className="mb-7">
                <h3 className="text-lg mb-3">Account settings</h3>
                <small className="text-gray-500">ACCOUNT PREFERENCES</small>
                <hr/>
            </div>
            <div className="mt-3">
                <div className="flex justify-between">
                    <div>
                        <h4 className="text-md">Email address</h4>
                        <p className="text-xs text-gray-500">{user?.email} {!user?.hasEmailVerified ? 'Not verified!' : null}</p>
                    </div>
                    <ButtonOutline disabled size="sm">
                        Change
                    </ButtonOutline>
                </div>
                <div className="flex justify-between mt-5">
                    <div>
                        <h4 className="text-md">Username</h4>
                        <p className="text-xs text-gray-500">{user?.username}</p>
                    </div>
                    <ChangeUsernameModal/>
                </div>
                <div className="flex justify-between mt-5">
                    <div>
                        <h4 className="text-md">Change password</h4>
                        <p className="text-xs text-gray-500">Password must be at least 8 characters long</p>
                    </div>
                    <ChangePasswordModal/>
                </div>
            </div>
        </div>
    )
}