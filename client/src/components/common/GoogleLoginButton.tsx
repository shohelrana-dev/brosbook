import React, { useEffect }                from 'react'
import { useRouter }                       from "next/router"
import { toast }                           from "react-toastify"
import { GoogleLogin, CredentialResponse } from '@react-oauth/google'
import { CircularProgress }                from "@mui/material"

import { useLoginWithGoogleMutation } from "@services/authApi"

function GoogleLoginButton(){
    //hooks
    const router                            = useRouter()
    const [login, { isLoading, isSuccess }] = useLoginWithGoogleMutation()


    async function responseGoogle( response: CredentialResponse ){
        try {
            login( response.credential! ).unwrap()
            router.push( '/' )
            toast.success( 'You have been logged in successfully.' )
        } catch ( err ) {
            console.error( err )
            toast.error( "Login was failed." )
        }
    }

    if( isSuccess || isLoading ) return (
        <div className="flex justify-center">
            <CircularProgress/>
        </div>
    )

    return (
        <div className="flex justify-center my-2">
            <GoogleLogin
                onSuccess={ responseGoogle }
                onError={ () => console.log( 'Google Login Failed' ) }
                useOneTap={ true }
            />
        </div>
    )
}

export default GoogleLoginButton
