import React, { FormEvent, Fragment, useEffect } from 'react'
import Head                                      from 'next/head'
import Link                                      from 'next/link'
import { Divider, LinearProgress }               from '@mui/material'

import { withGuest }                       from '@utils/withAuth'
import { loginAction, removeErrorsAction } from '@actions/authActions'
import InputGroup                          from '@components/common/InputGroup'
import GoogleLoginButton                   from '@components/common/GoogleLoginButton'
import PrimaryButton                       from "@components/common/PrimaryButton"
import { login, selectAuth }               from "@slices/authSlice"
import { useAppDispatch, useAppSelector }  from "@store/index"

function Login(){
    //hooks
    const dispatch              = useAppDispatch()
    const { isLoading, errors } = useAppSelector( selectAuth )

    useEffect( () => {
        if( errors && Object.keys( errors ).length > 0 ){
            dispatch( removeErrorsAction() )
        }
    }, [dispatch] )

    //handle form submit
    async function submitLoginForm( event: FormEvent<HTMLFormElement> ){
        event.preventDefault()

        const formData = {
            username: event.currentTarget.username.value, password: event.currentTarget.password.value
        }

        dispatch( login( formData ) )
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

                    <form method="post" onSubmit={ submitLoginForm }>
                        <InputGroup label="Username" name="username" className="mb-3" error={ errors.username }/>
                        <InputGroup label="Password" name="password" type="password" className="mb-3"
                                    error={ errors.password }/>
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
    </Fragment> )
}


export default withGuest( Login )
