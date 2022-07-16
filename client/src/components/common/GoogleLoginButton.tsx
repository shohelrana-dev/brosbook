import React                               from 'react'
import { useRouter }                       from "next/router"
import { toast }                           from "react-toastify"
import { GoogleLogin, CredentialResponse } from '@react-oauth/google'
import { useAppDispatch }                  from "@store/index"
import { loginWithGoogle }                 from "@slices/authSlice"

function GoogleLoginButton(){
    //hooks
    const router   = useRouter()
    const dispatch = useAppDispatch()

    const responseGoogle = async( response: CredentialResponse ) => {
        try {
            const data = await dispatch( loginWithGoogle( response.credential! ) ).unwrap()
            toast.success( data.message )
            await router.push( '/' )
        } catch ( err: any ) {
            toast.success( err?.message || 'Login failed' )
            await router.push( '/' )
        }
    }

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
