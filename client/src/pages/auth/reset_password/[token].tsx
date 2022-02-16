import React, { FormEvent, Fragment, useEffect, useState } from 'react'
import { useRouter }                                       from "next/router"
import Link                                                from "next/link"
import { useDispatch, useSelector }                        from "react-redux"
import Head                                                from "next/head"
import { LinearProgress }                                  from "@mui/material"
import { Lock }                                            from "@mui/icons-material"

import { removeErrorsAction, resetPasswordAction } from "@actions/authActions"
import InputGroup                                  from "@components/common/InputGroup"
import { withGuest }                               from "@utils/withAuth"
import PrimaryButton                               from "@components/common/PrimaryButton"
import api                                         from "@api/index"
import { toast }                                   from "react-toastify"
import { RootState }                               from "@store/index"

function Token() {
    //hooks
    const [ isTokenVerifying, setIsTokenVerifying ] = useState( true )
    const router                                    = useRouter()
    const dispatch                                  = useDispatch()
    const { isLoading, errors }                     = useSelector( ( state: RootState ) => state.auth )


    useEffect( () => {
        tokenVerify()
        dispatch( removeErrorsAction() )
    }, [ router, dispatch ] )

    async function tokenVerify() {
        const token = String( router.query.token )
        if ( !token || token === 'undefined' ) return

        try {
            await api.auth.resetPassTokenVerify( token )
            setIsTokenVerifying( false )
        } catch ( e ) {
            toast.error( 'Invalid token!' )
            await router.push( '/auth/login' )
        }
    }

    //handle form submit
    const submitForm = async ( event: FormEvent<HTMLFormElement> ) => {
        event.preventDefault()

        const formData = {
            password: event.currentTarget.password.value,
            confirmPassword: event.currentTarget.confirmPassword.value,
            token: String( router.query.token )
        }

        dispatch( resetPasswordAction( formData ) )
    }

    if ( isTokenVerifying ) {
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
                            <InputGroup label="Password" name="password" className="mb-3" error={ errors.password }/>
                            <InputGroup label="Confirm Password" name="confirmPassword" className="mb-3"
                                        error={ errors.confirmPassword }/>
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

export default withGuest( Token )
