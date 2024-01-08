"use client"
import React from 'react'
import useAuthState from "@/hooks/useAuthState"
import Loader from "@/components/global/Loader"
import ChangePasswordModal from "@/components/account/ChangePasswordModal"
import ChangeUsernameModal from "@/components/account/ChangeUsernameModal"
import TextOverflow from 'react-text-overflow'
import { Button } from '@mui/material'

export default function GeneralSettingsPage(){
    const { user, isAuthenticated } = useAuthState()

    if( ! isAuthenticated ) return <Loader/>

    return (
        <div className="p-4">
            <div className="mb-7">
                <h3 className="text-base sm:text-lg mb-3">Account settings</h3>
                <small className="text-gray-500">ACCOUNT PREFERENCES</small>
                <hr/>
            </div>
            <div className="mt-3">
                <div className="flex flex-wrap justify-between">
                    <div className="mr-1">
                        <h4 className="text-base">Email address</h4>
                        <p className="text-xs text-gray-500">
                            <TextOverflow
                                text={ `${ user?.email } ${ ! user?.hasEmailVerified ? 'Not verified!' : '' }` }/>
                        </p>
                    </div>
                    <div>
                        <Button variant="outlined" disabled>
                            Change
                        </Button>
                    </div>
                </div>
                <div className="flex flex-wrap justify-between mt-5">
                    <div className="mr-1">
                        <h4 className="text-base">Username</h4>
                        <p className="text-xs text-gray-500">
                            <TextOverflow text={ user?.username! }/>
                        </p>
                    </div>
                    <ChangeUsernameModal/>
                </div>
                <div className="flex justify-between mt-5">
                    <div className="mr-1">
                        <h4 className="text-base">Change password</h4>
                        <p className="text-xs text-gray-500">
                            <TextOverflow text="Password must be at least 8 characters long"/>
                        </p>
                    </div>
                    <ChangePasswordModal/>
                </div>
            </div>
        </div>
    )
}