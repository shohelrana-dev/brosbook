import React, { useEffect } from 'react'
import { useRouter, useSearchParams } from "next/navigation"
import toast from "react-hot-toast"
import { GoogleLogin, CredentialResponse, GoogleOAuthProvider } from '@react-oauth/google'
import { useLoginWithGoogleMutation } from "@services/authApi"

interface Props {
    setIsLoading: ( isLoading: boolean ) => void
}

function GoogleLoginButton( { setIsLoading }: Props ){
    //hooks
    const router                            = useRouter()
    const params                            = useSearchParams()
    const [login, { isLoading, isSuccess }] = useLoginWithGoogleMutation()

    async function responseGoogle( response: CredentialResponse ){
        try {
            await login( response.credential! ).unwrap()
            router.push( params.get( 'redirect_to' ) ? params.get( 'redirect_to' )! : '/' )
            toast.success( 'Logged in.' )
        } catch ( err: any ) {
            console.error( err )
            toast.error( err?.data?.message || "Login failed." )
        }
    }

    useEffect( () => {
        if( isLoading ){
            setIsLoading( true )
        } else if( isSuccess ){
            setIsLoading( true )
        } else{
            setIsLoading( false )
        }
    }, [isSuccess, isLoading] )

    return (
        <GoogleOAuthProvider clientId={ process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID! }>
            <div className="flex justify-center my-2">
                <GoogleLogin
                    onSuccess={ responseGoogle }
                    onError={ () => console.error( 'Google Login Failed' ) }
                    useOneTap={ true }
                />
            </div>
        </GoogleOAuthProvider>
    )
}

export default GoogleLoginButton
