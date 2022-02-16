import { Dispatch } from "redux"
import Router       from 'next/router'
import { toast }    from 'react-toastify'

import api                                                  from '@api/index'
import { User }                                             from "@interfaces/user.interfaces"
import { LoginFormData, ResetPassFormData, SignupFormData } from '@interfaces/auth.interfaces'
import { setAuth, setErrors, setLoading }                   from "@slices/authSlice"

export const signupAction = ( formData: SignupFormData ) => async ( dispatch: Dispatch ) => {
    dispatch( setLoading( true ) )

    try {
        //api call
        await api.auth.signup( formData )

        //set errors empty
        dispatch( setErrors( {} ) )

        //display success message and redirect to login page
        toast.success( "Sign Up successfully" )
        await Router.push( '/auth/login' )
    } catch ( err: any ) {
        const errors  = err.response?.data?.errors || {}
        const message = err.response?.data?.message

        //set errors and display error message
        dispatch( setErrors( errors ) )
        toast.error( message || "Sign Up failed!" )
    }
}


export const loginAction = ( formData: LoginFormData ) => async ( dispatch: Dispatch ) => {
    dispatch( setLoading( true ) )

    try {
        //api call
        const { data } = await api.auth.login( formData )

        //set authentication
        dispatch( setAuth( {
            isAuthenticated: true,
            user: data.user
        } ) )

        //display success message and redirect to home
        toast.success( data.message )
        Router.back()
    } catch ( err: any ) {
        const errors  = err.response?.data?.errors || {}
        const message = err.response?.data?.message

        //set errors and display error message
        dispatch( setErrors( errors ) )
        toast.error( message || "Log In failed!" )
    }
}

export const loginWithGoogleAction = ( tokenId: string ) => async ( dispatch: Dispatch ) => {
    dispatch( setLoading( true ) )

    try {
        //api call
        const { data } = await api.auth.loginWithGoogle( tokenId )

        //set authentication
        dispatch( setAuth( {
            isAuthenticated: true,
            user: data.user
        } ) )

        //display success message and redirect to home page
        toast.success( data.message )
        Router.back()
    } catch ( err ) {
        //display error message
        toast.error( "Log In failed!" )
    }
}

export const forgotPasswordAction = ( email: string ) => async ( dispatch: Dispatch ) => {
    dispatch( setLoading( true ) )

    try {
        //api call
        const { data } = await api.auth.forgotPassword( email )

        //set errors empty
        dispatch( setErrors( {} ) )

        //display success message and redirect to login page
        toast.success( data.message )
        await Router.push( '/auth/login' )
    } catch ( err: any ) {
        const errors  = err.response?.data?.errors || {}
        const message = err.response?.data?.message

        //set errors empty and display error message
        dispatch( setErrors( errors ) )
        toast.error( message || "Mail sending failed!" )
    }
}

export const resetPasswordAction = ( formData: ResetPassFormData ) => async ( dispatch: Dispatch ) => {
    dispatch( setLoading( true ) )

    try {
        //api call
        const { data } = await api.auth.resetPassword( formData )

        //set errors empty
        dispatch( setErrors( {} ) )

        //display success message and redirect to login page
        toast.success( data.message )
        await Router.push( '/auth/login' )
    } catch ( err: any ) {
        const errors  = err.response?.data?.errors || {}
        const message = err.response?.data?.message

        //set errors and display error message
        dispatch( setErrors( errors ) )
        toast.error( message || "Password reset was failed!" )
    }

}

export const verifyAccountAction = ( token: string ) => async ( dispatch: Dispatch ) => {
    dispatch( setLoading( true ) )

    try {
        //api call
        const { data } = await api.auth.verifyAccount( token )

        //redirect to login page and display success message
        toast.success( data.message )
        await Router.push( '/auth/login' )
    } catch ( err: any ) {
        const message = err.response?.data?.message

        //redirect to login page and display error message
        toast.error( message || 'Verification failed' )
        await Router.push( '/auth/login' )
    }
}

export const removeErrorsAction = () => async ( dispatch: Dispatch ) => {
    dispatch( setErrors( {} ) )
}

export const logoutAction = () => async ( dispatch: Dispatch ) => {
    dispatch( setLoading( true ) )

    try {
        //api call
        const { data } = await api.auth.logout()

        dispatch( setAuth( {
            isAuthenticated: false,
            user: <User>{}
        } ) )

        //redirect to login page and display success message
        toast.success( data.message )
        await Router.push( '/auth/login' )
    } catch ( err: any ) {
        const message = err.response?.data?.message

        //redirect to home page and display error message
        toast.error( message || 'Logout failed' )
        await Router.push( '/' )
    }
}

export const checkAuthAction = () => async ( dispatch: Dispatch ) => {
    try {
        //api call
        const { data } = await api.auth.me()

        //set authentication
        dispatch( setAuth( {
            isAuthenticated: true,
            user: data.user
        } ) )
    } catch ( err ) {
        //set authentication
        dispatch( setAuth( {
            isAuthenticated: false,
            user: <User>{}
        } ) )
    }
}