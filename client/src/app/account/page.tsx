"use client"
import React, {useState} from 'react'
import { useRouter } from "next/navigation"
import useAuth from "@hooks/useAuth"
import Loading from "@components/common/Loading"
import ButtonOutline from "@components/common/ButtonOutline"
import ChangePasswordModal from "@components/account/ChangePasswordModal";

export default function GeneralSettingsPage(){
    const router = useRouter()
    const {user, isAuthenticated} = useAuth()

    if(!isAuthenticated) return <Loading/>

    return(
        <div className="p-4">
            <div>
                <h3 className="text-lg mb-3">Account settings</h3>
                <small className="text-gray-500">ACCOUNT PREFERENCES</small>
                <div className="divider py-0 my-0 mt-[-7px]"></div>
            </div>
            <div className="mt-3">
                <div className="flex justify-between">
                    <div>
                        <h4 className="text-md">Email address</h4>
                        <p className="text-xs text-gray-500">{user?.email} {!user?.hasEmailVerified ? 'Not verified!' : null}</p>
                    </div>
                    <ButtonOutline title="Change" disabled/>
                </div>
                <div className="flex justify-between mt-5">
                    <div>
                        <h4 className="text-md">Change password</h4>
                        <p className="text-xs text-gray-500">Password must be at least 8 characters long</p>
                    </div>
                    <ButtonOutline>
                        <label htmlFor="change-password-modal" className="block cursor-pointer">Change</label>
                    </ButtonOutline>
                    <ChangePasswordModal/>
                </div>
            </div>
        </div>
    )
}