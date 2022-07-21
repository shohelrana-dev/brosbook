import React, { useEffect }                from 'react'
import { useRouter }                       from "next/router"
import { toast }                           from "react-toastify"
import { GoogleLogin, CredentialResponse } from '@react-oauth/google'
import { CircularProgress }                from "@mui/material"

import { useLoginWithGoogleMutation } from "@services/authApi"
import { useAppSelector }             from "@store/store"
import { selectAuthState }            from "@features/authSlice"

function GoogleLoginButton(){
    //hooks
    const router                                                  = useRouter()
    const { isAuthenticated }                                     = useAppSelector( selectAuthState )
    const [login, { isLoading, isSuccess, isError, data, error }] = useLoginWithGoogleMutation()

    const errorData = ( error && 'data' in error && error.data as any ) || {}

    useEffect( () => {
        isSuccess && toast.success( data?.message )
        isError && toast.error( errorData?.message )

        if( isSuccess && isAuthenticated ){
            router.push( '/' )
        }
    }, [isSuccess, isError, isAuthenticated] )

    const responseGoogle = async( response: CredentialResponse ) => {
        login( response.credential! )
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
