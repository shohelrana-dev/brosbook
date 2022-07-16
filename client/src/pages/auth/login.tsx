import React, { FormEvent, Fragment, useEffect, useState } from 'react'
import Head                                                from 'next/head'
import Link                                                from 'next/link'
import { Divider, LinearProgress }                         from '@mui/material'

import InputGroup                                          from '@components/common/InputGroup'
import GoogleLoginButton                                   from '@components/common/GoogleLoginButton'
import PrimaryButton                                       from "@components/common/PrimaryButton"
import { clearInputErrors, login, reset, selectAuthState } from "@slices/authSlice"
import { useAppDispatch, useAppSelector }                  from "@store/index"
import { useRouter }                                       from "next/router"
import { toast }                                           from "react-toastify"

function Login(){
    //hooks
    const router                                                                   = useRouter()
    const dispatch                                                                 = useAppDispatch()
    const { isLoading, inputErrors, isSuccess, isError, isAuthenticated, message } = useAppSelector( selectAuthState )
    const [username, setUsername]                                                  = useState<string>( '' )
    const [password, setPassword]                                                  = useState<string>( '' )

    useEffect( () => {
        if( Object.keys( inputErrors ).length > 0 ){
            dispatch( clearInputErrors() )
        }
    }, [dispatch] )

    useEffect( () => {
        if( isSuccess ){
            toast.success( message )
        } else if( isError ){
            toast.error( message )
        }

        if( isSuccess && isAuthenticated ){
            router.push( '/' )
        }

        dispatch( reset() )
    }, [isSuccess, isError, isAuthenticated, router] )

    //handle form submit
    async function onSubmit( event: FormEvent ){
        event.preventDefault()

        dispatch( login( { username, password } ) )
    }

    return ( <Fragment>
            <Head>
                <title>Log In | BrosBook</title>
            </Head>

            <div className="h-screen flex flex-col bg-theme-gray">
                <div className="w-90 mx-auto mt-12 lg:mt-28">
                    { isLoading && <LinearProgress/> }

                    <div className="bg-white p-8 border border-gray-300">
                        <h1 className="text-xl text-center mb-4 font-medium">Log In</h1>

                        <form method="post" onSubmit={ onSubmit }>
                            <InputGroup
                                label="Username"
                                name="username" className="mb-3"
                                error={ inputErrors.username }
                                onChange={ ( e ) => setUsername( e.target.value ) }
                            />
                            <InputGroup
                                label="Password"
                                name="password"
                                type="password"
                                className="mb-3"
                                error={ inputErrors.password }
                                onChange={ ( e ) => setPassword( e.target.value ) }
                            />
                            <PrimaryButton type="submit" buttonTitle="Log In" isLoading={ isLoading }/>
                        </form>

                        <Divider className="text-gray-700 mb-6 mt-5">
                            OR
                        </Divider>

                        <GoogleLoginButton/>

                        <small className="block text-center">
                            <Link href="/auth/forgot_password">
                                <a className="text-blue-500">
                                    Forgotten your password?
                                </a>
                            </Link>
                        </small>
                    </div>

                    <div className="bg-white p-6 border border-gray-300 text-center mt-2">
                        <p className="text-gray-800">
                            Don&apos;t have an account?
                            <Link href="/auth/signup">
                                <a className="ml-1 text-blue-500 font-medium">
                                    Sign Up
                                </a>
                            </Link>
                        </p>
                    </div>

                </div>
            </div>
        </Fragment>
    )
}


export default Login
