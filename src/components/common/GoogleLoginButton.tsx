import React from 'react'
import { useRouter, useSearchParams } from "next/navigation"
import toast from "react-hot-toast"
import { GoogleLogin, CredentialResponse, GoogleOAuthProvider } from '@react-oauth/google'

import { useLoginWithGoogleMutation } from "@services/authApi"
import Loading from "@components/common/Loading"

function GoogleLoginButton(){
    //hooks
    const router                            = useRouter()
    const params                            = useSearchParams()
    const [login, { isLoading, isSuccess }] = useLoginWithGoogleMutation()

    async function responseGoogle( response: CredentialResponse ){
        try {
            await login( response.credential! ).unwrap()
            router.push( params.get( 'redirect' ) ? params.get( 'redirect' )! : '/' )
            toast.success( 'Logged in.' )
        } catch ( err: any ) {
            console.error( err )
            toast.error( err?.data?.message || "Login failed." )
        }
    }

    if( isSuccess || isLoading ) return <Loading/>

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
