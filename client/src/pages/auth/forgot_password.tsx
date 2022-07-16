import React, { FormEvent, Fragment, useEffect } from 'react'
import Head                                      from "next/head"
import { LinearProgress }                        from "@mui/material"
import Link                                      from "next/link"
import { Lock }                                  from '@mui/icons-material'
import { toast }                                 from "react-toastify"
import { useRouter }                             from "next/router"

import InputGroup                                            from "@components/common/InputGroup"
import PrimaryButton                                         from "@components/common/PrimaryButton"
import { clearInputErrors, forgotPassword, selectAuthState } from "@slices/authSlice"
import { useAppDispatch, useAppSelector }                    from "@store/index"

function ForgotPassword(){
    //hooks
    const router                     = useRouter()
    const dispatch                   = useAppDispatch()
    const { isLoading, inputErrors } = useAppSelector( selectAuthState )

    useEffect( () => {
        if( Object.keys( inputErrors ).length > 0 ){
            dispatch( clearInputErrors() )
        }
    }, [dispatch] )

    //handle form submit
    async function submitForm( event: FormEvent<HTMLFormElement> ){
        event.preventDefault()

        const email: string = event.currentTarget.email.value

        try {
            const data = await dispatch( forgotPassword( email ) ).unwrap()
            toast.success( data.message )
            await router.push( '/auth/login' )
        } catch ( err: any ) {
            toast.error( err?.message || 'Something went wrong' )
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

                        <form method="post" onSubmit={ submitForm }>
                            <InputGroup label="Email" name="email" className="mb-3" error={ inputErrors.email }/>
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

export default ForgotPassword
