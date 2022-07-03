import React from 'react'
import {useDispatch} from "react-redux"
import {GoogleLogin, CredentialResponse} from '@react-oauth/google'

import {loginWithGoogleAction} from "@actions/authActions"

function GoogleLoginButton() {
    //hooks
    const dispatch = useDispatch()

    const responseGoogle = async (response: CredentialResponse) => {
        dispatch(loginWithGoogleAction(response.credential!))
    }

    return (
        <div className="flex justify-center my-2">
            <GoogleLogin
                onSuccess={responseGoogle}
                onError={() => console.log('Google Login Failed')}
                useOneTap={true}
            />
        </div>
    )
}

export default GoogleLoginButton
