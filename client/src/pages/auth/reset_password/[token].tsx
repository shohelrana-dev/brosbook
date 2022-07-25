import React, { FormEvent, Fragment, useEffect, useState } from 'react'
import { useRouter }                                       from "next/router"
import Link                                                from "next/link"
import Head                                                from "next/head"
import { LinearProgress }                                  from "@mui/material"
import { Lock }                                            from "@mui/icons-material"
import { toast }                                           from "react-toastify"
import useAsyncEffect                                      from "use-async-effect"

import InputGroup                   from "@components/common/InputGroup"
import PrimaryButton                from "@components/common/PrimaryButton"
import { useAppDispatch }           from "@store/store"
import { useResetPasswordMutation } from "@services/authApi";
import { InputErrors } from "@interfaces/index.interfaces"
import Http            from "@utils/http"

function Token(){
    //hooks
    const router                                                          = useRouter()
    const [resetPassword, { isLoading, isSuccess, isError, data, error }] = useResetPasswordMutation()

    const [isTokenVerifying, setIsTokenVerifying] = useState<boolean>( true )
    const [password, setPassword]                 = useState<string>( '' )
    const [confirmPassword, setConfirmPassword]   = useState<string>( '' )

    const errorData   = ( error && 'data' in error && error.data as any ) || {}
    const inputErrors = errorData.errors || {} as InputErrors

    useEffect( () => {
        isSuccess && toast.success( data?.message )
        isError && toast.error( errorData?.message )

        if( isSuccess ){
            router.push( '/auth/login' )
        }
    }, [isSuccess, isError] )

    useAsyncEffect( tokenVerify, [router] )

    async function tokenVerify(){
        const token = router.query.token as string
        if( ! token || token === 'undefined' ) return

        try {
            await Http.get( `${ process.env.NEXT_PUBLIC_SERVER_API_URL }/auth/reset_password/${ token }` )
            setIsTokenVerifying( false )
        } catch ( e ) {
            toast.error( 'Invalid token!' )
            await router.push( '/auth/login' )
        }
    }

    //handle form submit
    const submitForm = async( event: FormEvent<HTMLFormElement> ) => {
        event.preventDefault()

        const token = router.query.token as string

        resetPassword( { password, confirmPassword, token } )
    }

    if( isTokenVerifying ){
        return <LinearProgress/>
    }

    return (
        <Fragment>
            <Head>
                <title>Reset Password | BrosBook</title>
            </Head>

            <div className="h-screen flex flex-col bg-theme-gray">
                <div className="w-90 mx-auto mt-12 lg:mt-28">
                    { isLoading && <LinearProgress/> }

                    <div className="bg-white p-8 border border-gray-300">
                        <div className="text-center mb-2">
                            <Lock fontSize="large"/>
                        </div>
                        <h1 className="text-lg text-center mb-4 font-medium">Create a strong password</h1>
                        <small className="block text-gray-500 text-center mb-2">
                            Enter your your new password to reset account password.
                            Your password must be at least six characters.
                        </small>

                        <form method="post" onSubmit={ submitForm }>
                            <InputGroup
                                label="Password"
                                name="password"
                                className="mb-3"
                                error={ inputErrors.password }
                                onChange={ ( e ) => setPassword( e.target.value ) }
                            />
                            <InputGroup
                                label="Confirm Password"
                                name="confirmPassword"
                                className="mb-3"
                                error={ inputErrors.confirmPassword }
                                onChange={ ( e ) => setConfirmPassword( e.target.value ) }
                            />
                            <PrimaryButton type="submit" buttonTitle="Reset" isLoading={ isLoading }/>
                        </form>
                    </div>

                    <div className="bg-white p-6 border border-gray-300 text-center mt-2">
                        <p className="text-gray-800">
                            Go back?
                            <Link href="/auth/login">
                                <a className="ml-1 text-blue-500 font-medium">
                                    Log In
                                </a>
                            </Link>
                        </p>
                    </div>

                </div>
            </div>
        </Fragment>
    )
}

export default Token
