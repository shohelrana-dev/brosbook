import React, { FormEvent, Fragment, useEffect, useState } from 'react'
import { useRouter }                                       from "next/router"
import Link                                                from "next/link"
import Head                                                from "next/head"
import { LinearProgress }                                  from "@mui/material"
import { Lock }                                            from "@mui/icons-material"

import InputGroup                                           from "@components/common/InputGroup"
import PrimaryButton                                        from "@components/common/PrimaryButton"
import { toast }                                            from "react-toastify"
import { useAppDispatch, useAppSelector }                   from "@store/index"
import authApi                                              from "../../../api/auth"
import { clearInputErrors, resetPassword, selectAuthState } from "@slices/authSlice"

function Token(){
    //hooks
    const [isTokenVerifying, setIsTokenVerifying] = useState( true )
    const router                                  = useRouter()
    const dispatch                                = useAppDispatch()
    const { isLoading, inputErrors }              = useAppSelector( selectAuthState )


    useEffect( () => {
        tokenVerify()
        dispatch( clearInputErrors() )
    }, [router, dispatch] )

    async function tokenVerify(){
        const token = router.query.token as string
        if( ! token || token === 'undefined' ) return

        try {
            await authApi.resetPassTokenVerify( token )
            setIsTokenVerifying( false )
        } catch ( e ) {
            toast.error( 'Invalid token!' )
            await router.push( '/auth/login' )
        }
    }

    //handle form submit
    const submitForm = async( event: FormEvent<HTMLFormElement> ) => {
        event.preventDefault()

        const formData = {
            password: event.currentTarget.password.value,
            confirmPassword: event.currentTarget.confirmPassword.value,
            token: String( router.query.token )
        }

        dispatch( resetPassword( formData ) )
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
                            <InputGroup label="Password" name="password" className="mb-3"
                                        error={ inputErrors.password }/>
                            <InputGroup label="Confirm Password" name="confirmPassword" className="mb-3"
                                        error={ inputErrors.confirmPassword }/>
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
