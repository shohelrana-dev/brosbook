import React, { FormEvent, useState } from 'react'
import Avatar                         from "@components/common/Avatar"
import MainLayout                     from "@components/layouts/MainLayout"
import BasicInput                     from "@components/common/BasicInput"
import LeftSidebar                    from "@components/settings/LeftSidebar"
import ensureServerSideAuth           from "@utils/ensureServerSideAuth";
import { InputErrors }                from "@interfaces/index.interfaces";
import { useSelector }                from "react-redux";
import { selectAuthState }            from "@features/authSlice";

function Password(){
    //hooks
    const { user }                      = useSelector( selectAuthState )
    const [inputErrors, setInputErrors] = useState<InputErrors>( {} )

    const [oldPassword, setOldPassword]               = useState<string>( '' )
    const [newPassword, setNewPassword]               = useState<string>( '' )
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>( '' )

    function onSubmitForm( event: FormEvent<HTMLFormElement> ){
        event.preventDefault()

    }

    return (
        <MainLayout>
            <div className=" pt-6">
                <div className="box flex">
                    {/*sidebar*/ }
                    <LeftSidebar/>

                    {/*Form*/ }
                    <form className="flex-auto" onSubmit={ onSubmitForm }>
                        <div className="flex items-center">
                            <div className="w-3/12 flex justify-end p-4">
                                <Avatar online={ false } src={ user.photo } alt={ user.username }/>
                            </div>
                            <div className="flex-auto p-4">
                                <h3 className="text-xl">{ user.username }</h3>
                            </div>
                        </div>

                        <BasicInput label="Old Password" name="oldPassword" type="password"
                                    error={ inputErrors.oldPassword }/>
                        <BasicInput label="New Password" name="newPassword" type="password"
                                    error={ inputErrors.newPassword }/>
                        <BasicInput label="Confirm New Password" name="confirmNewPassword" type="password"
                                    error={ inputErrors.confirmNewPassword }/>

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

export default Password

export const getServerSideProps = ensureServerSideAuth