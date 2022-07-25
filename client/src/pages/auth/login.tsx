import React, { FormEvent, Fragment, useEffect, useState } from 'react'
import Head                                                from 'next/head'
import Link                                                from 'next/link'
import { Divider, LinearProgress }                         from '@mui/material'

import InputGroup              from '@components/common/InputGroup'
import GoogleLoginButton       from '@components/common/GoogleLoginButton'
import PrimaryButton           from "@components/common/PrimaryButton"
import { useRouter }           from "next/router"
import { GetServerSideProps }  from "next"
import { withGuestServerSide } from "@hoc/withAuth"
import { useLoginMutation }    from "@services/authApi"
import { InputErrors }         from "@interfaces/index.interfaces"
import { toast }               from "react-toastify"

function Login(){
    //hooks
    const router                                                  = useRouter()
    const [login, { isLoading, data, error, isSuccess, isError }] = useLoginMutation()
    const [username, setUsername]                                 = useState<string>( '' )
    const [password, setPassword]                                 = useState<string>( '' )

    const errorData   = ( error && 'data' in error && error.data as any ) || {}
    const inputErrors = errorData.errors || {} as InputErrors

    useEffect( () => {
        if( isSuccess ){
            router.push( '/' )
            toast.success( data?.message )
        }
    }, [isSuccess] )

    useEffect( () => { isError && toast.error( errorData.message )}, [isError] )

    //handle form submit
    function onLoginFormSubmit( event: FormEvent ){
        event.preventDefault()

        login( { username, password } )
    }

    if( isSuccess ){
        return <LinearProgress/>
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

                        <form method="post" onSubmit={ onLoginFormSubmit }>
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

// @ts-ignore
export const getServerSideProps: GetServerSideProps = withGuestServerSide( async() => {
    return {
        props: {}
    }
} )

export default Login
