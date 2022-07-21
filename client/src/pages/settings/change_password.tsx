import React, { FormEvent }         from 'react'
import { useDispatch, useSelector } from "react-redux"

import { RootState } from "@store/store"
import Avatar        from "@components/common/Avatar"
import { withAuth }    from "@utils/withAuth"
import MainLayout      from "@components/layouts/MainLayout"
import BasicInputGroup from "@components/common/BasicInputGroup"
import LeftSidebar        from "@components/settings/LeftSidebar"
import { changePassword } from "@actions/settingsActions";

function ChangePassword() {
    //hooks
    const { user, errors } = useSelector( ( state: RootState ) => state.settings )
    const dispatch         = useDispatch()

    function submitFormHandle( event: FormEvent<HTMLFormElement> ) {
        event.preventDefault()
        const data = {
            oldPassword: event.currentTarget.oldPassword.value,
            newPassword: event.currentTarget.newPassword.value,
            confirmNewPassword: event.currentTarget.confirmNewPassword.value,
        }
        dispatch( changePassword( data ) )
        event.currentTarget.reset()
    }

    return (
        <MainLayout>
            <div className="container pt-6">
                <div className="box flex">
                    {/*sidebar*/ }
                    <LeftSidebar/>

                    {/*Form*/ }
                    <form className="flex-auto" onSubmit={ submitFormHandle }>
                        <div className="flex items-center">
                            <div className="w-3/12 flex justify-end p-4">
                                <Avatar online={ false } src={ user.photo } alt={ user.username }/>
                            </div>
                            <div className="flex-auto p-4">
                                <h3 className="text-xl">{ user.username }</h3>
                            </div>
                        </div>

                        <BasicInputGroup label="Old Password" name="oldPassword" type="password"
                                         error={ errors.oldPassword }/>
                        <BasicInputGroup label="New Password" name="newPassword" type="password"
                                         error={ errors.newPassword }/>
                        <BasicInputGroup label="Confirm New Password" name="confirmNewPassword" type="password"
                                         error={ errors.confirmNewPassword }/>

                        <div className="flex items-center">
                            <div className="w-3/12 flex justify-end p-4"/>
                            <div className="p-4">
                                <button type="submit" className="button-blue">
                                    Change Password
                                </button>
                            </div>
                        </div>

                    </form>

                </div>
            </div>
        </MainLayout>
    )
}

export default withAuth( ChangePassword )