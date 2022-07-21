import React, { FormEvent, Fragment, useEffect, useState } from 'react'
import Head                                                from 'next/head'
import Link                                                from 'next/link'
import { Alert, Divider, LinearProgress }                  from '@mui/material'
import zxcvbn                                              from 'zxcvbn-typescript'
import { toast }                                           from "react-toastify"
import { useRouter }                                       from "next/router"

import InputGroup            from '@components/common/InputGroup'
import GoogleLoginButton     from "@components/common/GoogleLoginButton"
import PrimaryButton         from "@components/common/PrimaryButton"
import { useSignupMutation } from "@services/authApi"
import { InputErrors }       from "@interfaces/index.interfaces";

function Signup(){
    //hooks
    const router                                                   = useRouter()
    const [signup, { isLoading, data, error, isSuccess, isError }] = useSignupMutation()

    const [firstName, setFirstName] = useState<string>( '' )
    const [lastName, setLastName]   = useState<string>( '' )
    const [email, setEmail]         = useState<string>( '' )
    const [username, setUsername]   = useState<string>( '' )
    const [password, setPassword]   = useState<string>( '' )

    const [passwordWarning, setPasswordWarning] = useState( '' )

    const errorData = ( error && 'data' in error && error.data as any ) || {}
    const inputErrors = errorData.errors || {} as InputErrors

    useEffect( () => {
        isSuccess && toast.success( data?.message )
        isError && toast.error( errorData?.message )

        if( isSuccess ){
            router.push( '/auth/login' )
        }

    }, [isSuccess, isError] )

    //handle form submit
    async function onSignupFormSubmit( event: FormEvent ){
        event.preventDefault()

        signup( { firstName, lastName, email, username, password } )
    }

    function checkPasswordWarning(){
        setPasswordWarning( zxcvbn( password, [] )?.feedback?.warning )
    }

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

                        <form method="post" onSubmit={ onSignupFormSubmit }>
                            <InputGroup
                                label="First Name"
                                name="firstName"
                                className="mb-2"
                                error={ inputErrors.firstName }
                                onChange={ ( e => setFirstName( e.target.value ) ) }
                            />
                            <InputGroup
                                label="Last Name"
                                name="lastName"
                                className="mb-2"
                                error={ inputErrors.lastName }
                                onChange={ ( e => setLastName( e.target.value ) ) }
                            />
                            <InputGroup
                                label="Email"
                                name="email"
                                className="mb-2"
                                error={ inputErrors.email }
                                onChange={ ( e => setEmail( e.target.value ) ) }
                            />
                            <InputGroup
                                label="Username"
                                name="username"
                                className="mb-2"
                                error={ inputErrors.username }
                                onChange={ ( e => setUsername( e.target.value ) ) }
                            />
                            <InputGroup
                                label="Password"
                                name="password"
                                type="password"
                                className="mb-2"
                                error={ inputErrors.password }
                                onChange={ ( e ) => {
                                    setPassword( e.target.value )
                                    checkPasswordWarning()
                                } }
                            />
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

export default Signup
