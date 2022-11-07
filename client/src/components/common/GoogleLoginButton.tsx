import React                               from 'react'
import { useRouter }                       from "next/navigation"
import { toast }                           from "react-toastify"
import {GoogleLogin, CredentialResponse, GoogleOAuthProvider} from '@react-oauth/google'

import { useLoginWithGoogleMutation } from "@services/authApi"
import Loading from "@components/common/Loading"

function GoogleLoginButton(){
    //hooks
    const router                            = useRouter()
    const [login, { isLoading, isSuccess }] = useLoginWithGoogleMutation()


    async function responseGoogle( response: CredentialResponse ){
        try {
            await login( response.credential! ).unwrap()
            router.push( '/' )
            toast.success( 'You have been logged in successfully.' )
        } catch ( err: any ) {
            console.error( err )
            toast.error( err?.data?.message || "Login has been failed." )
        }
    }

    if( isSuccess || isLoading ) return  <Loading/>

    return (
        <GoogleOAuthProvider clientId={ process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID! }>
            <div className="flex justify-center my-2">
                <GoogleLogin
                    onSuccess={ responseGoogle }
                    onError={ () => console.log( 'Google Login Failed' ) }
                    useOneTap={ true }
                />
            </div>
        </GoogleOAuthProvider>
    )
}

export default GoogleLoginButton
