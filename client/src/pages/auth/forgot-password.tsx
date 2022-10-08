import React, { FormEvent, Fragment, useState } from 'react'
import Head                                     from "next/head"
import { LinearProgress }                       from "@mui/material"
import Link                                     from "next/link"
import { Lock }                                 from '@mui/icons-material'
import { toast }                                from "react-toastify"
import { useRouter }                            from "next/router"

import AnimatedInput from "@components/common/AnimatedInput"
import PrimaryButton from "@components/common/PrimaryButton"
import { useForgotPasswordMutation } from "@services/authApi"
import { InputErrors }               from "@interfaces/index.interfaces"

function ForgotPassword(){
    //hooks
    const router                          = useRouter()
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation()
    const [inputErrors, setInputErrors]   = useState<InputErrors>( {} )
    const [email, setEmail]               = useState<string>( '' )

    //handle form submit
    async function submitForm( event: FormEvent ){
        event.preventDefault()

        try {
            await forgotPassword( email ).unwrap()
            router.push( '/auth/login' )
            toast.success( 'A reset password link has been sent to your email.' )
        } catch ( err: any ) {
            console.error(err)
            toast.error( err?.data?.message )
            if( err?.data?.errors ) setInputErrors( err.data.errors )
        }
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

                        <form onSubmit={ submitForm }>
                            <AnimatedInput
                                label="Email"
                                name="email"
                                className="mb-3"
                                error={ inputErrors.email }
                                onChange={ ( e ) => setEmail( e.target.value ) }
                            />
                            <PrimaryButton type="submit" buttonTitle="Send Reset Link" isLoading={ isLoading }/>
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

export default ForgotPassword
