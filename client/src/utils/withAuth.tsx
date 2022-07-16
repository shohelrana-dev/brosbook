
import { useRouter }              from 'next/router'
import { ElementType, useEffect } from 'react'
import { useSelector }            from 'react-redux'

import { GetServerSideProps, GetServerSidePropsContext } from "next"
import { selectAuthState }                                    from "@slices/authSlice"

export function withGuest( Component: ElementType ) {
    return function Guest( props: unknown ) {
        const router              = useRouter()
        const { isAuthenticated } = useSelector( selectAuthState )

        useEffect( () => {
            if ( isAuthenticated ) router.push( '/' )
        }, [ router ] )

        return <Component { ...props }/>
    }
}

export function withAuth( Component: ElementType ) {
    return function Auth( props: unknown ) {
        const router              = useRouter()
         const { isAuthenticated } = useSelector( selectAuth )

         useEffect( () => {
         if ( !isAuthenticated ) router.push( '/auth/login' )
         }, [ router ] )

        return <Component { ...props }/>
    }
}

export function requireAuth( gssp: GetServerSideProps ) {
    return async ( context: GetServerSidePropsContext ) => {
        const { req }      = context
        const access_token = req.cookies.access_token

        try {
            //api call
            const response = await fetch( `${ process.env.NEXT_PUBLIC_SERVER_API_URL }/auth/me`, {
                headers: { "Authorization": "Bearer " + access_token }
            } )
            const data     = await response.json()

            //check user
            if ( data.success && data.user ) {
                context.req.user            = data.user
                context.req.isAuthenticated = true
                return await gssp( context )
            }

            //redirect
            return {
                redirect: {
                    destination: '/auth/login',
                    statusCode: 302
                }
            }
        } catch ( err: any ) {
            console.log( err )
        }
    }
}
