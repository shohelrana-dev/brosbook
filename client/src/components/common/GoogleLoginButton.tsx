import React           from 'react'
import Image           from "next/image"
import { useDispatch } from "react-redux"
import GoogleLogin     from "react-google-login"

import GoogleLogo                from "@images/google-logo.svg"
import { loginWithGoogleAction } from "@actions/authActions"

function GoogleLoginButton() {
    //hooks
    const dispatch = useDispatch()

    const responseGoogle = ( { tokenId }: any ): void => {
        dispatch( loginWithGoogleAction( tokenId ) )
    }

    return (
        <GoogleLogin
            render={ renderProps => (
                <button
                    className="button button-bordered w-full rounded flex justify-center"
                    onClick={ renderProps.onClick }
                    disabled={ renderProps.disabled }
                >
                    <Image src={ GoogleLogo } width={ 20 } height={ 20 } alt="Google Logo"/>
                    <span className="mt-1">&nbsp; Log in with Google</span>
                </button>
            ) }
            clientId={ process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID! }
            onSuccess={ responseGoogle }
            onFailure={ ( err ) => console.log( err ) }
            cookiePolicy={ 'single_host_origin' }
        />
    )
}

export default GoogleLoginButton
