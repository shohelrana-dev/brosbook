import React, { FormEvent, Fragment, useState } from 'react'
import Head                                     from 'next/head'
import Link                                     from 'next/link'
import { Divider, LinearProgress }              from '@mui/material'

import AnimatedInput     from '@components/common/AnimatedInput'
import GoogleLoginButton from '@components/common/GoogleLoginButton'
import PrimaryButton         from "@components/common/PrimaryButton"
import { useRouter }         from "next/router"
import { useLoginMutation }  from "@services/authApi"
import { InputErrors }       from "@interfaces/index.interfaces"
import { toast }             from "react-toastify"
import ensureServerSideGuest from "@utils/ensureServerSideGuest"
import InputPassword         from "@components/common/InputPassword"
import { Lock }              from "@mui/icons-material";

function Login(){
    //hooks
    const router                            = useRouter()
    const [login, { isLoading, isSuccess }] = useLoginMutation()
    const [inputErrors, setInputErrors]     = useState<InputErrors>( {} )
    const [username, setUsername]           = useState<string>( '' )
    const [password, setPassword]           = useState<string>( '' )


    //handle form submit
    async function onLoginFormSubmit( event: FormEvent ){
        event.preventDefault()

        try {
            await login( { username, password } ).unwrap()
            router.push( '/' )
            toast.success( 'You have been logged in successfully.' )
        } catch ( err: any ) {
            console.error( err )
            if( err?.data?.errors ) setInputErrors( err.data.errors )
            toast.error( err?.data?.message || 'Invalid credentials.' )
        }
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
                        <div className="text-center mb-2">
                            <Lock fontSize="large"/>
                        </div>
                        <h1 className="text-xl text-center mb-4 font-medium">Log In</h1>

                        <form method="post" onSubmit={ onLoginFormSubmit }>
                            <AnimatedInput
                                label="Username or email"
                                name="username"
                                error={ inputErrors.username }
                                onChange={ ( e ) => setUsername( e.target.value ) }
                            />
                            <InputPassword
                                label="Password"
                                name="password"
                                error={ inputErrors.password }
                                onChange={ ( e ) => setPassword( e.target.value ) }
                            />
                            <PrimaryButton type="submit" buttonTitle="Log In" isLoading={ isLoading }/>
                        </form>

                        <Divider className="text-gray-700 !my-4">
                            OR
                        </Divider>

                        <GoogleLoginButton/>

                        <small className="block text-center">
                            <Link href="/auth/forgot-password">
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

export const getServerSideProps = ensureServerSideGuest
