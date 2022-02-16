import React, { ChangeEvent, FormEvent, Fragment, useEffect, useState } from 'react'
import Head                                                             from 'next/head'
import Link                                                             from 'next/link'
import { Alert, Divider, Fade, LinearProgress }                         from '@mui/material'
import { useDispatch, useSelector }                                     from 'react-redux'
import zxcvbn                                                           from 'zxcvbn-typescript'

import InputGroup                           from '@components/common/InputGroup'
import { removeErrorsAction, signupAction } from '@actions/authActions'
import { withGuest }                        from '@utils/withAuth'
import GoogleLoginButton                    from "@components/common/GoogleLoginButton"
import PrimaryButton                        from "@components/common/PrimaryButton"
import { SignupFormData }                   from "@interfaces/auth.interfaces"
import { RootState }                        from "@store/index"

function Signup() {
    //hooks
    const dispatch              = useDispatch()
    const { errors, isLoading } = useSelector( ( state: RootState ) => state.auth )

    const [ passwordWarning, setPasswordWarning ] = useState( '' )

    useEffect( () => {
        if ( Object.keys( errors ).length > 0 ) {
            dispatch( removeErrorsAction() )
        }
    }, [ dispatch ] )

    //handle form submit
    async function submitSignupForm( event: FormEvent<HTMLFormElement> ) {
        event.preventDefault()

        const formData: SignupFormData = {
            firstName: event.currentTarget.firstName.value,
            lastName: event.currentTarget.lastName.value,
            email: event.currentTarget.email.value,
            username: event.currentTarget.username.value,
            password: event.currentTarget.password.value
        }

        dispatch( signupAction( formData ) )

    }

    function passwordChangeHandle( event: ChangeEvent<HTMLInputElement> ) {
        setPasswordWarning( zxcvbn( event.currentTarget.value, [] )?.feedback?.warning )
    }

    console.log( passwordWarning )

    return (
        <Fragment>
            <Head>
                <title>Sign Up | BrosBook</title>
            </Head>

            <div className="h-screen flex flex-col bg-theme-gray">
                <div className="w-90 mx-auto mt-12 lg:mt-16">
                    { isLoading && <LinearProgress/> }

                    <div className="bg-white p-8 border border-gray-300">
                        <h1 className="text-xl text-center mb-4 font-medium">Sign Up</h1>

                        <GoogleLoginButton/>

                        <Divider className="text-gray-700 mb-6 mt-5">
                            OR
                        </Divider>

                        <form method="post" onSubmit={ submitSignupForm }>
                            <InputGroup label="First Name" name="firstName" className="mb-2"
                                        error={ errors.firstName }/>
                            <InputGroup label="Last Name" name="lastName" className="mb-2" error={ errors.lastName }/>
                            <InputGroup label="Email" name="email" className="mb-2" error={ errors.email }/>
                            <InputGroup label="Username" name="username" className="mb-2" error={ errors.username }/>
                            <InputGroup onChange={ passwordChangeHandle } label="Password" name="password"
                                        type="password" className="mb-2"
                                        error={ errors.password }/>
                            { passwordWarning && (
                                <Alert className="mb-2" variant="outlined"
                                       severity="warning">{ passwordWarning }</Alert>
                            ) }
                            <PrimaryButton type="submit" buttonTitle="Sign Up" isLoading={ isLoading }/>
                        </form>

                        <div className="text-center">
                            <small className="text-gray-600">
                                By signing up, you agree to our Terms, Data Policy and Cookie Policy.
                            </small>
                        </div>

                    </div>

                    <div className="bg-white p-6 border border-gray-300 text-center mt-2">
                        <p className="text-gray-800">
                            Have an account?
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

export default withGuest( Signup )
