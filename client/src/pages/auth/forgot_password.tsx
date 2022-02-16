import React, { FormEvent, Fragment, useEffect } from 'react'
import Head                                      from "next/head"
import { LinearProgress }                        from "@mui/material"
import Link                                      from "next/link"
import { useDispatch, useSelector }              from "react-redux"
import { Lock }                                  from '@mui/icons-material'

import InputGroup                                   from "@components/common/InputGroup"
import { removeErrorsAction, forgotPasswordAction } from "@actions/authActions"
import { withGuest }                                from "@utils/withAuth"
import PrimaryButton                                from "@components/common/PrimaryButton"
import { RootState }                                from "@store/index"

function ForgotPassword() {
    //hooks
    const dispatch              = useDispatch()
    const { isLoading, errors } = useSelector( ( state: RootState ) => state.auth )

    useEffect( () => {
        if ( Object.keys( errors ).length > 0 ) {
            dispatch( removeErrorsAction() )
        }
    }, [ dispatch ] )

    //handle form submit
    async function submitForm( event: FormEvent<HTMLFormElement> ) {
        event.preventDefault()

        const email: string = event.currentTarget.email.value

        dispatch( forgotPasswordAction( email ) )
    }

    return (
        <Fragment>
            <Head>
                <title>Forgot Password | BrosBook</title>
            </Head>

            <div className="h-screen flex flex-col bg-theme-gray">
                <div className="w-90 mx-auto mt-12 lg:mt-28">
                    { isLoading && <LinearProgress/> }

                    <div className="bg-white p-8 border border-gray-300">
                        <div className="text-center mb-2">
                            <Lock fontSize="large"/>
                        </div>
                        <h1 className="text-xl text-center mb-4 font-medium">Trouble with logging in?</h1>
                        <small className="block text-gray-500 text-center mb-2">
                            Enter your email address and we will send you a link to get back into your account.
                        </small>

                        <form method="post" onSubmit={ submitForm }>
                            <InputGroup label="Email" name="email" className="mb-3" error={ errors.email }/>
                            <PrimaryButton type="submit" buttonTitle="Send Login Link" isLoading={ isLoading }/>
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

export default withGuest( ForgotPassword )
